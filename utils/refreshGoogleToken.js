const axios = require("axios");
const qs = require("querystring");

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const refreshGoogleToken = async (refreshToken) => {
  const { data } = await axios.post(
    GOOGLE_TOKEN_URL,
    qs.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
};

module.exports = refreshGoogleToken;
