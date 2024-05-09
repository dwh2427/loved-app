// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  page: { type: mongoose.Schema.ObjectId, ref: "Loved" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
