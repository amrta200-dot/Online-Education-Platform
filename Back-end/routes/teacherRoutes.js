import express from "express";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import authMiddleware from "../middleware/authMiddleware.js";
import teacherMiddleware from "../middleware/teacherMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

console.log("🔥 CLOUDINARY TEACHER ROUTES LOADED");

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "fasly/teachers",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });

router.get("/", async (req, res) => {
    try {
    const teachers = await User.find(
        { role: "teacher" },
        {   
            name: 1,
            subject: 1,
            image: 1,
        }).sort({ createdAt: -1 });

    const formattedTeachers = teachers.map((teacher) => ({
        id: teacher._id,
        name: teacher.name,
        subject: teacher.subject,
        image: teacher.image,
    }));

    res.json(formattedTeachers);
    } catch (error) {
    console.error("Get teachers error:", error.message);

    res.status(500).json({
        message: "Something went wrong",
    });
    }
});
router.get("/me",authMiddleware,teacherMiddleware,async (req, res) => {

    try {
        const teacher = await User.findById(req.user.userId).select(
            "-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordExpires"
        );

        if (!teacher) {
        return res.status(404).json({
            message: "Teacher not found",
        });
        }

        res.json({
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            subject: teacher.subject,
            image: teacher.image,
            role: teacher.role,
        });
    } catch (error) {
        console.error("Get current teacher error:", error.message);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
    }
);

router.put("/me" , authMiddleware, teacherMiddleware, upload.single("image"),

async (req, res) => {
    console.log("🔥 PUT /api/teachers/me ROUTE HIT");
  try {
    console.log("🔥 UPLOAD DEBUG:", {
      hasFile: !!req.file,
      file: req.file
        ? {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            hasBuffer: !!req.file.buffer,
          }
        : null,
    });

    const { name, subject } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          message: "Teacher name is required",
        });
      }

      if (!subject || !subject.trim()) {
        return res.status(400).json({
          message: "Teacher subject is required",
        });
      }

      const teacher = await User.findById(req.user.userId);

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      teacher.name = name.trim();
      teacher.subject = subject.trim();

      // لو المدرس اختار صورة جديدة
if (req.file) {
  console.log("FILE RECEIVED:", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    hasBuffer: !!req.file.buffer,
  });

  const result = await uploadToCloudinary(req.file.buffer);

  console.log("CLOUDINARY RESULT:", result.secure_url);

  teacher.image = result.secure_url;
}

      await teacher.save();

      res.json({
        message: "Teacher profile updated successfully",

        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
          image: teacher.image,
          role: teacher.role,
        },
      });
    } catch (error) {
      console.error("Update teacher profile error:", error.message);

      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);
router.get("/dashboard/stats",authMiddleware,teacherMiddleware,async (req, res) => {
    try {
      const teacherId = req.user.userId;

      // إجمالي دروس المدرس
      const totalLessons = await Lesson.countDocuments({
        teacher: teacherId,
      });

      // الدروس القادمة
      const upcomingLessons = await Lesson.countDocuments({
        teacher: teacherId,
        status: "upcoming",
      });

      // الدروس المباشرة الآن
      const liveLessons = await Lesson.countDocuments({
        teacher: teacherId,
        status: "live",
      });

      // إجمالي الطلاب المؤكدين على المنصة
      const totalStudents = await User.countDocuments({
        role: "student",
        emailVerified: true,
      });

      res.json({
        totalLessons,
        upcomingLessons,
        liveLessons,
        totalStudents,
      });

    } catch (error) {
      console.error(
        "Get dashboard stats error:",
        error
      );

      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);
router.get("/:id", async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: "teacher",
    }).select(
      "name email subject image role"
    );
    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }
    res.json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      image: teacher.image,
      role: teacher.role,
    });
  } catch (error) {
    console.error("Get teacher by id error:", error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;