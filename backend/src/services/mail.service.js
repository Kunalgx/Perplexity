const requiredEmailVariables = [
  "GOOGLE_USER",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
];

function assertEmailConfiguration() {
  const missingVariables = requiredEmailVariables.filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing email configuration: ${missingVariables.join(", ")}`);
  }
}

function encodeMessage(message) {
  return Buffer.from(message, "utf8").toString("base64url");
}

function createRawMessage({ from, to, subject, text, html }) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="email-boundary"',
    "",
    "--email-boundary",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    "--email-boundary",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    "--email-boundary--",
  ].join("\r\n");

  return encodeMessage(message);
}

async function getAccessToken() {
  assertEmailConfiguration();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Google OAuth token request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Google OAuth token response did not include an access token");
  }

  return data.access_token;
}

export async function sendEmail(to, subject, text, html) {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  const accessToken = await getAccessToken();
  const raw = createRawMessage({
    from: process.env.GOOGLE_USER,
    to,
    subject,
    text,
    html,
  });

  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(process.env.GOOGLE_USER)}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gmails API send request failed with status ${response.status}`);
  }

  return response.json();
}