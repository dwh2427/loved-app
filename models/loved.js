// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    family_member_type: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    story: { type: String },
    pageFor: {
      type: String,
      enum: ["friend", "family_member", "yourself"],
      required: true,
    },
    images: [{ type: String }],
  },
  { timestamps: true },
);

const Loved = mongoose.models.Loved || mongoose.model("Loved", userSchema);

export default Loved;
