const brevoApiUrl = "https://api.brevo.com/v3";
const brevoApiKey = process.env.BREVO_API_KEY?.trim();
const emailUser = process.env.EMAIL_USER?.trim();

if (!brevoApiKey || !emailUser) {
  console.warn("BREVO_API_KEY ou EMAIL_USER nao foram configurados.");
}

const brevoRequest = async (path, options = {}) => {
  const response = await fetch(`${brevoApiUrl}${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      "api-key": brevoApiKey,
      "content-type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const responseBody = await response.text();
    const error = new Error(`Brevo respondeu com status ${response.status}.`);
    error.code = "BREVO_API_ERROR";
    error.response = responseBody;
    throw error;
  }

  return response;
};

const sendEmail = async (options) => {
  await brevoRequest("/smtp/email", {
    method: "POST",
    body: JSON.stringify({
      sender: {
        name: "Equipe Renature",
        email: emailUser,
      },
      to: [{ email: options.email }],
      subject: options.subject,
      textContent: options.message,
    }),
  });
};

const verifyEmailTransport = async () => {
  await brevoRequest("/account");
};

module.exports = { sendEmail, verifyEmailTransport };
