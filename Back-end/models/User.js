import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    // بيانات المدرس
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    // Email Verification
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
    // خاص بالحساب الجديد أثناء التسجيل فقط
    // لو لم يتم تأكيد الإيميل خلال 10 دقائق
    // سيتم حذف الحساب تلقائيًا بواسطة MongoDB
    verificationExpiresAt: {
      type: Date,
      default: null,
    },
    // Reset Password
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
// حذف الحساب غير المؤكد تلقائيًا
userSchema.index(
  { verificationExpiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      emailVerified: false,
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;