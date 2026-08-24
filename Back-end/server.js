import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import teacherMiddleware from "./middleware/teacherMiddleware.js";
import cookieParser from "cookie-parser";
import path from "path";

// live 
import dotenv from "dotenv";
import livekitRoutes from "./routes/livekitRoutes.js";

// Tacherlesson
import lessonRoutes from "./routes/lessonRoutes.js";


dotenv.config();

const app = express();
app.use( cors({ origin: process.env.FRONTEND_URL , credentials: true,}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/livekit", livekitRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


const PORT = process.env.PORT || 5000;
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
connectDB();
app.get("/", (req, res) => {
    res.send("Faslay Backend is working!");
});
app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working!",
    });
});
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user,
    });
});
app.get( "/api/teacher/dashboard", authMiddleware, teacherMiddleware, (req, res) => {
    res.json({
        message: "Welcome to Teacher Dashboard!",
        teacherId: req.user.userId,
    });
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

