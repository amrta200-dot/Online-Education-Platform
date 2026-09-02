import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, code) {
    const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [email],
    subject: "تحقق من حساب منصة فصلي الخاص بك",
    html: `
    <div dir="rtl">
        <h2>منصة فصلي</h2>
        <p>رمز التحقق الخاص بك هو:</p>
        <h1>${code}</h1>
        <p>من فضلك لا تشارك هذا الرمز مع أي شخص.</p>
    </div>
    `,
});
    if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
    }
    console.log("Verification email sent:", data?.id);
}
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//     },
// });

// export async function sendVerificationEmail(email, code) {
//     await transporter.sendMail({
//         from: `"منصة فصلي" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "تحقق من حساب منصة فصلي الخاص بك",
//         text: `رمز التحقق الخاص بك هو: ${code}`,
//     });
// }