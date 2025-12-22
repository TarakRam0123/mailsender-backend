const MailDraft = require("../model/mailmodel");

const saveDraft = async (req, res) => {
  try {
    const { subject, body, attachments } = req.body;

    const draft = await MailDraft.findOneAndUpdate(
      { user: req.userid }, // 🔐 one draft per user
      {
        subject,
        body,
        attachments: attachments || [],
        isDraft: true,
      },
      {
        new: true,
        upsert: true, // 🔥 create if not exists
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      status: true,
      message: "Draft saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
const getDraft = async (req, res) => {
  try {
    const draft = await MailDraft.findOne({ user: req.userid });

    if (!draft) {
      return res.status(200).json({
        status: true,
        draft: null,
        message: "No draft found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Draft retrieved successfully",
      draft,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getPreviousMails = async (req, res) => {
  try {
    const mail = await MailDraft.findOne(
      { user: req.userid },
      { previousTo: 1, _id: 0 } // 🔥 return only history
    );

    if (!mail) {
      return res.status(404).json({
        message: "Draft not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Previous mail history retrieved",
      status: true,
      previousTo: mail.previousTo || [], // ✅ always array
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

module.exports = { saveDraft, getPreviousMails, getDraft };

const sendDraftMail = async (req, res) => {
  try {
    const { draftId, to } = req.body;

    if (!to) {
      return res.status(400).json({
        message: "Recipient email is required",
        status: false,
      });
    }

    const draft = await MailDraft.findOne({
      _id: draftId,
      user: req.userid,
    });

    if (!draft) {
      return res.status(404).json({
        message: "Draft not found",
        status: false,
      });
    }

    // 🔥 SEND MAIL HERE (Gmail OAuth)
    // subject: draft.subject
    // body: draft.body
    // attachments: draft.attachments

    // 🧾 SAVE SEND HISTORY
    draft.previousTo.push({
      email: to,
    });

    await draft.save();

    res.json({
      status: true,
      message: "Mail sent & history updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
