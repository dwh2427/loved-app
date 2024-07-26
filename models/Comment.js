import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  likes: [
    {
      userId: { type: mongoose.Schema.ObjectId, ref: "User",  },
    },
  ],

  replies: [
    {
      replied_by: { type: mongoose.Schema.ObjectId, ref: "User" },
      replyText: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  tipAmount: {
    type: Number,
    default: 0,
  },
  page_name: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comment_by: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Comments =
  mongoose.models.Comments || mongoose.model("Comments", commentSchema);

export default Comments;
