import SibApiV3Sdk from "@getbrevo/brevo";
import brevo from "./brevoClient.js";

export async function sendEmailBrevo({
  fromName,
  fromEmail,
  to,
  subject,
  html,
}) {
  const message = new SibApiV3Sdk.SendSmtpEmail();

  message.sender = { name: fromName, email: fromEmail };
  message.to = [{ email: to }];
  message.subject = subject;
  message.htmlContent = html;

  try {
    const res = await brevo.sendTransacEmail(message);
    return res;
  } catch (err) {
    // penting untuk debugging Brevo
    const details = err?.response?.body || err?.message || err;
    console.error("Brevo send error:", details);
    throw err;
  }
}
