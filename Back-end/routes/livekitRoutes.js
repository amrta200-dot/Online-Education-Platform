import express from "express";
import { AccessToken } from "livekit-server-sdk";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/token", authMiddleware, async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("LIVEKIT TOKEN REQUEST");
    console.log("========================================");
    // Room
    const { room } = req.query;
    console.log("Room:", room);
    if (!room || typeof room !== "string") {
      return res.status(400).json({
        message: "Room is required",
      });
    }
    //  User from JWT
    const userId = req.user?.userId;
    const jwtRole = req.user?.role;

    console.log("JWT userId:", userId);
    console.log("JWT role:", jwtRole);
    if (!userId) {
      return res.status(401).json({
        message: "User ID is missing from authentication token",
      });
    }
    //  Check role
    if (jwtRole !== "teacher" && jwtRole !== "student") {
      return res.status(403).json({
        message: "You are not allowed to join live classes",
      });
    }
    //  Check LiveKit environment variables
    const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY?.trim();
    const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET?.trim();
    const LIVEKIT_URL = process.env.LIVEKIT_URL?.trim();

    console.log(
      "LIVEKIT_API_KEY exists:",
      Boolean(LIVEKIT_API_KEY)
    );

    console.log(
      "LIVEKIT_API_SECRET exists:",
      Boolean(LIVEKIT_API_SECRET)
    );

    console.log(
      "LIVEKIT_URL:",
      LIVEKIT_URL
    );

    if (
      !LIVEKIT_API_KEY ||
      !LIVEKIT_API_SECRET ||
      !LIVEKIT_URL
    ) {
      console.error(
        "ERROR: LiveKit environment variables are missing"
      );

      return res.status(500).json({
        message: "LiveKit configuration is missing",
      });
    }

    // 5. Get user from MongoDB

    const user = await User.findById(userId).select(
      "name email role image"
    );

    if (!user) {
      console.error(
        "ERROR: User not found:",
        userId
      );

      return res.status(404).json({
        message: "User not found",
      });
    }

    // 6. Make sure DB role is valid

    if (
      user.role !== "teacher" &&
      user.role !== "student"
    ) {
      return res.status(403).json({
        message: "Invalid user role",
      });
    }

    /*
      نستخدم الدور الموجود في قاعدة البيانات
      وليس الدور الموجود في JWT فقط.
    */

    const role = user.role;

    // 7. User display name

    const userName =
      user.name?.trim() ||
      user.email?.split("@")[0] ||
      "مستخدم";

    console.log("DB user ID:", user._id.toString());
    console.log("DB user name:", userName);
    console.log("DB user role:", role);

    // 8. Create AccessToken

    const at = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      {
        /*
          identity يجب أن يكون unique.

          لا نضع الاسم هنا.
          نستخدم MongoDB ID كـ identity.
        */

        identity: user._id.toString(),

        /*
          الاسم الذي يظهر داخل LiveKit
        */

        name: userName,

        /*
          Token صالح لمدة ساعة
        */

        ttl: "1h",
      }
    );

    // 9. SAME permissions for teacher and student

    const grant = {
      /*
        السماح بدخول الغرفة
      */
      roomJoin: true,

      /*
        اسم الغرفة
      */
      room: room,

      /*
        السماح بنشر الصوت والفيديو والشاشة
      */
      canPublish: true,

      /*
        السماح بمشاهدة / استقبال الآخرين
      */
      canSubscribe: true,

      /*
        السماح بإرسال Data
        وهذا مستخدم للتعليقات
      */
      canPublishData: true,

      /*
        السماح بتحديث metadata الخاصة بالمستخدم
        اختياري، لكنه مفيد لو أردت تحديث معلومات المستخدم.
      */
      canUpdateOwnMetadata: true,
    };

    // 10. Teacher ONLY = Room Admin

    if (role === "teacher") {
      grant.roomAdmin = true;
    }

    // 11. Add grant

    at.addGrant(grant);

    // 12. Generate JWT

    const token = await at.toJwt();

    if (!token) {
      throw new Error(
        "LiveKit returned an empty token"
      );
    }

    // 13. Debug

    console.log("LiveKit token generated successfully");

    console.log("Room:", room);
    console.log("Identity:", user._id.toString());
    console.log("Name:", userName);
    console.log("Role:", role);

    console.log("Permissions:");
    console.log("- roomJoin: true");
    console.log("- canPublish: true");
    console.log("- canSubscribe: true");
    console.log("- canPublishData: true");
    console.log("- canUpdateOwnMetadata: true");
    console.log(
      "- roomAdmin:",
      role === "teacher"
    );

    console.log("========================================\n");

    // 14. Response

    return res.status(200).json({
      token,

      room,

      serverUrl: LIVEKIT_URL,

      user: {
        id: user._id.toString(),
        name: userName,
        role,
        image: user.image || "",
      },
    });

  } catch (error) {
    // IMPORTANT:
    // نطبع الخطأ الحقيقي وليس فقط message عام

    console.error("\n========================================");
    console.error("LIVEKIT TOKEN ERROR");
    console.error("========================================");

    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);

    console.error("Full error:", error);

    console.error("========================================\n");

    return res.status(500).json({
      message: "Could not generate LiveKit token",

      /*
        في development فقط نرسل تفاصيل الخطأ.
        في production الأفضل عدم إرسال stack للـ frontend.
      */

      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error?.message,
    });
  }
});

export default router;