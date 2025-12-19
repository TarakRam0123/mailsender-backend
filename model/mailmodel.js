const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema(
  {
    fileName: String,
    fileType: String,
    fileSize: Number,
    url: String,
    publicId: String,
  },
  { _id: false }
);

const PreviousToSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const MailDraftSchema = new mongoose.Schema(
  {
    // 🔐 ONE draft per user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🔥 THIS is the key change
    },

    subject: {
      type: String,
      trim: true,
    },

    body: {
      type: String,
    },

    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

    // 🧾 Send history
    previousTo: {
      type: [PreviousToSchema],
      default: [],
    },

    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MailDraft", MailDraftSchema);
