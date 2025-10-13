import SibApiV3Sdk from "@getbrevo/brevo";
import config from "../../config/index.js";

// Pakai API khusus transactional email
const api = new SibApiV3Sdk.TransactionalEmailsApi();

api.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  config.brevo_api_key
);

export default api;
