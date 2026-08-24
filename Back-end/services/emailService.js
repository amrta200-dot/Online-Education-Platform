import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(email, code) {
    await transporter.sendMail({
        from: `"منصة فصلي" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "تحقق من حساب منصة فصلي الخاص بك",
        text: `رمز التحقق الخاص بك هو: ${code}`,
    });
}