const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendWelcomeEmail({ to, firstName }) {
  const from = process.env.SMTP_FROM;

  const subject = "Welcome to AI Taralog";
  const html = `
    <h2>Welcome to AI Taralog</h2>
    <p>Hi ${firstName || "there"}! Your account is ready.</p>
    <p>You can now log in and start your readings.</p>
  `;

  return transporter.sendMail({ from, to, subject, html });
}

module.exports = { sendWelcomeEmail };
