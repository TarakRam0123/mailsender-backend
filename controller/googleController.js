const axios = require("axios");
const qs = require("querystring");
const User = require("../model/usermodel");
const refreshGoogleToken = require("../utils/refreshGoogleToken");

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.send",
].join(" ");

// 1️⃣ Redirect user to Google
exports.connectGoogle = (req, res) => {
  const state = req.userid; // 🔥 bind OAuth to user

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  }).toString();

  res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
};

// 2️⃣ Google OAuth Callback
exports.googleCallback = async (req, res) => {
  const { code, state: userid } = req.query;

  try {
    const { data } = await axios.post(
      GOOGLE_TOKEN_URL,
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const user = await User.findById(userid);
    if (!user) return res.status(404).send("User not found");

    // Remove old Google provider if exists
    user.providers = user.providers.filter((p) => p.provider !== "google");

    // Save Google provider
    user.providers.push({
      provider: "google",
      email: user.email,
      providerId: "google-oauth",
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      scope: data.scope,
      tokenType: data.token_type,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    });

    await user.save();

    res.redirect(`${process.env.FRONT_END}/mail/sendmail`);
  } catch (err) {
    console.error("Google OAuth error:", err.response?.data || err.message);
    res.status(500).send("Google OAuth failed");
  }
};

// 3️⃣ Check Gmail connection
exports.checkGoogleConnection = async (req, res) => {
  const user = await User.findById(req.userid);
  const google = user?.providers.find((p) => p.provider === "google");

  res.json({ googleConnected: !!google });
};

// 4️⃣ Send Gmail (PER USER)
exports.sendGoogleMail = async (req, res) => {
  const { to, subject, body } = req.body;

  const user = await User.findById(req.userid);
  const google = user?.providers.find((p) => p.provider === "google");

  if (!google) {
    return res.status(400).json({ message: "Gmail not connected" });
  }
  // 🔁 AUTO REFRESH if expired
  if (google.expiresAt && google.expiresAt < new Date()) {
    if (!google.refreshToken) {
      return res.status(401).json({ message: "Re-connect Gmail required" });
    }

    const refreshed = await refreshGoogleToken(google.refreshToken);

    google.accessToken = refreshed.accessToken;
    google.expiresAt = refreshed.expiresAt;

    await user.save();
  }

  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/html; charset=utf-8",
    "",
    body,
  ].join("\r\n");

  const encoded = Buffer.from(raw)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await axios.post(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    { raw: encoded },
    {
      headers: {
        Authorization: `Bearer ${google.accessToken}`,
      },
    }
  );

  res.json({ message: "Email sent via Gmail!" });
};
