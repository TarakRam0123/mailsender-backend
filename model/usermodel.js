const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema(
  {
    provider: {
      type: String, // google | microsoft | zoho
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    scope: String,
    tokenType: {
      type: String,
      default: "Bearer",
    },
    expiresAt: {
      type: Date,
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: String,
    providers: {
      type: [ProviderSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
