const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER?.trim();
const emailPassword = process.env.EMAIL_PASS?.replace(/\s/g, "");

if (!emailUser || !emailPassword) {
  console.warn("EMAIL_USER ou EMAIL_PASS nao foram configurados.");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
});

const sendEmail = async (options) => {
  const message = {
    from: `"Equipe Renature" <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

const verifyEmailTransport = async () => {
  await transporter.verify();
};

module.exports = { sendEmail, verifyEmailTransport };
