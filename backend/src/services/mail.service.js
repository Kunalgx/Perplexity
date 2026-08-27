import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
  }
});

transporter.verify((error) => {
  if (error) {
    console.error("EMAIL ERROR:");
    console.error("name:", error.name);
    console.error("message:", error.message);
    console.error("code:", error.code);
    console.error("response:", error.response);
    console.error("responseCode:", error.responseCode);
  } else {
    console.log("Email server is ready");
  }
});

export async function sendEmail(to, subject, text, html) {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    text,
    html
  };

  const result = await transporter.sendMail(mailOptions);

  return result;
}

export default transporter;