import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    number: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["upcoming", "live", "completed"],
        default: "upcoming",
    },
    studentsJoined: {
        type: Number,
        default: 0,
    },
    // اسم غرفة LiveKit
    roomName: {
        type: String,
        required: true,
        unique: true,
    },
},
    {
        timestamps: true,
    }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;