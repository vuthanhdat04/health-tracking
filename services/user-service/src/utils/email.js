import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Health Tracking" <no-reply@health.com>`,
      to,
      subject,
      html,
    });

    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Send email failed:", err);
    throw err;
  }
};
