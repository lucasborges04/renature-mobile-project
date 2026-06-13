const nodemailer = require("nodemailer");
const dns = require("node:dns").promises;

const emailUser = process.env.EMAIL_USER?.trim();
const emailPassword = process.env.EMAIL_PASS?.replace(/\s/g, "");
const gmailHost = "smtp.gmail.com";

if (!emailUser || !emailPassword) {
  console.warn("EMAIL_USER ou EMAIL_PASS nao foram configurados.");
}

const createTransporter = async () => {
  const addresses = await dns.resolve4(gmailHost);

  if (addresses.length === 0) {
    throw new Error("Nenhum endereco IPv4 foi encontrado para o Gmail SMTP.");
  }

  return nodemailer.createTransport({
    host: addresses[0],
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
    tls: {
      servername: gmailHost,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  });
};

const sendEmail = async (options) => {
  const transporter = await createTransporter();
  const message = {
    from: `"Equipe Renature" <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(message);
};

const verifyEmailTransport = async () => {
  const transporter = await createTransporter();
  await transporter.verify();
};

module.exports = { sendEmail, verifyEmailTransport };
