import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const verificationCode = Math.floor( 100000 + Math.random() * 900000 ).toString();

    const verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    await user.save();

    await sendVerificationEmail(
      user.email,
      verificationCode
    );

    res.json({
      message: "Verification code sent to your email",
      email: user.email,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.post("/verify-code", async (req, res) => {
    try {
        const { email, code, purpose } = req.body;
        // 1. التأكد من البيانات
        if (!email || !code || !purpose) {
            return res.status(400).json({
                message: "Email, code and purpose are required",
            });
        }
        // 2. البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // 3. التأكد من الكود
        if ( !user.verificationCode || user.verificationCode !== code ) {
            return res.status(400).json({
                message: "Invalid verification code",
            });
        }
        // 4. التأكد من انتهاء الصلاحية
        if ( !user.verificationCodeExpires || user.verificationCodeExpires < new Date() ) {
            return res.status(400).json({
                message: "Verification code expired",
            });
        }
        if (purpose === "register") {
              user.emailVerified = true; 
              user.verificationCode = undefined;
              user.verificationCodeExpires = undefined;
              user.registrationExpiresAt = undefined;
              await user.save();
              const token = jwt.sign(
                  {
                      userId: user._id,
                      role: user.role,
                  },
                  process.env.JWT_SECRET,
                  {
                      expiresIn: "7d",
                  }
              );
            
                res.cookie("token", token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                  maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            
              return res.json({
                  message: "Account verified successfully!",
                  user: {
                      id: user._id,
                      name: user.name,
                      email: user.email,
                      role: "student",
                      emailVerified: true,
                  },
              });
          }
        if (purpose === "login") {
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save();
            const token = jwt.sign(
              {
                userId: user._id,
                role: user.role,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.json({
              message: "Login verified successfully!",
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
            });
          }
          if (purpose === "forgotpassword") {
            const resetToken = crypto.randomBytes(32).toString("hex");
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save();
            return res.json({
                message: "Code verified successfully!",
                resetToken,
            });
        }
        return res.status(400).json({
            message: "Invalid verification purpose",
        });
    } catch (error) {
        console.error(
            "Verify code error:",
            error.message
        );
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 1. التأكد إن البيانات موجودة
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }
    // 2. التأكد إن الإيميل مش مستخدم قبل كده
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // 3. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. إنشاء كود التحقق
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 5. تحديد صلاحية الكود - 10 دقائق
    const verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // 6. إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    
      emailVerified: false,
    
      verificationCode,
      verificationCodeExpires,
    
      registrationExpiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    // 7. إرسال الكود للإيميل
    await sendVerificationEmail(
      user.email,
      verificationCode
    );

    // 8. الرد على Frontend
    res.status(201).json({
      message: "Verification code sent to your email",
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});


router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email ",
      });
    }
    const verificationCode = Math.floor( 100000 + Math.random() * 900000 ).toString();
    const verificationCodeExpires = new Date( Date.now() + 10 * 60 * 1000 );
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    await user.save();

    await sendVerificationEmail(
      user.email,
      verificationCode
    );

    res.json({
      message: "Verification code sent to your email",
      email: user.email,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    // 1. التأكد إن البيانات موجودة
    if (!resetToken || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    // 2. البحث عن المستخدم
    const user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: {
            $gt: new Date(),
        },
    });
    if (!user) {
      return res.status(404).json({
        message: "إذا كان البريد الإلكتروني مسجلًا لدينا، فسيتم إرسال رمز التحقق",
      });
    }
    // 3. تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(password, 10);
    // 4. استبدال كلمة المرور القديمة بالجديدة
      user.password = hashedPassword;
        
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
        
      await user.save();
    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    message: "Logged out successfully",
  });
});


export default router;