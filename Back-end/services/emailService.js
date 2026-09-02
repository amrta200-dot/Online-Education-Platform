export async function sendVerificationEmail(email, code) {
    try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            sender: {
                name: "منصة فصلي",
                email: "amr.ttttt300@gmail.com",
        },
        to: [
            {
                email,
            },
        ],
        subject: "تحقق من حساب منصة فصلي الخاص بك",
        htmlContent: `
        <div dir="rtl">
            <h2>منصة فصلي</h2>
            <p>رمز التحقق الخاص بك هو:</p>
            <h1>${code}</h1>
            <p>من فضلك لا تشارك هذا الرمز مع أي شخص.</p>
        </div>
        `,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Brevo email error:", data);
        throw new Error(data.message || "Failed to send email");
    }

    console.log("Verification email sent:", data);
    } catch (error) {
    console.error("Brevo email error:", error.message);
    throw error;
    }
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