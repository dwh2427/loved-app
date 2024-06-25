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
  page_name: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comments =
  mongoose.models.Comments || mongoose.model("Comments", commentSchema);

export default Comments;
