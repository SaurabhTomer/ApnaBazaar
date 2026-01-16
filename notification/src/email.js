import dotenv from "dotenv";
dotenv.config();
 
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password ONLY
  },
});

// ⚠️ Comment this if you still see errors
// transporter.verify();

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"ApnaBazaar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

sendEmail(
  "saurabhtomer47@gmail.com",
  "Test Email",
  "Test email",
  "<b>Test email</b>"
);
