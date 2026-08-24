import express from "express";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import teacherMiddleware from "../middleware/teacherMiddleware.js";

const router = express.Router();
router.post("/", authMiddleware, teacherMiddleware, async (req, res) => {
  try {
    const { title, number, date, time, password } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Lesson title is required",
      });
    }

    if (!number) {
      return res.status(400).json({
        message: "Lesson number is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Lesson date is required",
      });
    }

    if (!time) {
      return res.status(400).json({
        message: "Lesson time is required",
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({
        message: "Lesson password must be at least 4 characters",
      });
    }

    const teacher = await User.findById(req.user.userId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const roomName = `lesson-${teacher._id}-${Date.now()}`;

    const lesson = await Lesson.create({
      title: title.trim(),
      number: Number(number),
      date,
      time,
      password,
      teacher: teacher._id,
      status: "upcoming",
      studentsJoined: 0,
      roomName,
    });

    res.status(201).json({
      message: "Lesson created successfully",
      lesson: {
        id: lesson._id,
        title: lesson.title,
        number: lesson.number,
        date: lesson.date,
        time: lesson.time,
        status: lesson.status,
        passwordProtected: true,
        studentsJoined: lesson.studentsJoined,
        roomName: lesson.roomName,
      },
    });

  } catch (error) {
    console.error("Create lesson error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/my",authMiddleware,teacherMiddleware,async (req, res) => {
    try {
        const lessons = await Lesson.find({
            teacher: req.user.userId,
        }).sort({
            createdAt: -1,
        });
    const formattedLessons = lessons.map((lesson) => ({
        id: lesson._id,
        title: lesson.title,
        date: lesson.date,
        time: lesson.time,
        number: lesson.number,
        status: lesson.status,
        passwordProtected: true,
        studentsJoined: lesson.studentsJoined,
        roomName: lesson.roomName,
    }));

        res.json(formattedLessons);
    } catch (error) {
        console.error("Get teacher lessons error:", error);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
    }
);
router.delete(
  "/:id",
  authMiddleware,
  teacherMiddleware,
  async (req, res) => {
    try {
      const lesson = await Lesson.findOne({
        _id: req.params.id,
        teacher: req.user.userId,
      });

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found",
        });
      }

      await lesson.deleteOne();

      res.json({
        message: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error("Delete lesson error:", error);

      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);
router.post("/:id/verify-password",async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          message: "Lesson password is required",
        });
      }

      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found",
        });
      }

      if (lesson.password !== password) {
        return res.status(401).json({
          message: "كود الدخول غير صحيح",
        });
      }

      return res.json({
        message: "Password verified successfully",
        success: true,
        lesson: {
          id: lesson._id,
          roomName: lesson.roomName,
        },
      });

    } catch (error) {
      console.error("Verify lesson password error:", error);

      return res.status(500).json({
        message: "حدث خطأ أثناء التحقق من كود الدخول",
      });
    }
  }
);
router.put("/:id",authMiddleware,teacherMiddleware,async (req, res) => {
    try {
      const { title, date, time, password,number } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({
          message: "Lesson title is required",
        });
      }

      if (!date) {
        return res.status(400).json({
          message: "Lesson date is required",
        });
      }
      if (!number) {
        return res.status(400).json({
          message: "Lesson date is required",
        });
      }

      if (!time) {
        return res.status(400).json({
          message: "Lesson time is required",
        });
      }

      const lesson = await Lesson.findOne({
        _id: req.params.id,
        teacher: req.user.userId,
      });

      if (!lesson) {
        return res.status(404).json({
          message: "Lesson not found",
        });
      }

      lesson.title = title.trim();
      lesson.date = date;
      lesson.time = time;
      lesson.number = number;

      // لو المدرس كتب كلمة مرور جديدة نحدثها
      if (password && password.length >= 4) {
        lesson.password = password;
      }

      await lesson.save();

      res.json({
        message: "Lesson updated successfully",
        lesson: {
          id: lesson._id,
          title: lesson.title,
          date: lesson.date,
          time: lesson.time,
          number: lesson.number,
          status: lesson.status,
          passwordProtected: true,
          studentsJoined: lesson.studentsJoined,
          roomName: lesson.roomName,
        },
      });
    } catch (error) {
      console.error("Update lesson error:", error);

      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
);

router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const lessons = await Lesson.find({
      teacher: req.params.teacherId,
      status: { $in: ["upcoming", "live"] },
    }).sort({
      date: 1,
      time: 1,
    });

    const formattedLessons = lessons.map((lesson) => ({
      id: lesson._id,
      title: lesson.title,
      date: lesson.date,
      time: lesson.time,
      number: lesson.number,
      status: lesson.status,
      passwordProtected: true,
      studentsJoined: lesson.studentsJoined,
      roomName: lesson.roomName,
    }));

    res.json(formattedLessons);
  } catch (error) {
    console.error("Get public teacher lessons error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default router;