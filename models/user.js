// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
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
    password: {
      type: String,
      required: true,
    },
    page: { type: mongoose.Schema.ObjectId, ref: "Loved" },
    additional_info: {
      stripe_acc_id: { type: String },
      date_of_birth: { type: Date },
      country: { type: String },
      currency: { type: String },
      city: { type: String },
      country: { type: String },
      state: { type: String },
      street_address: { type: String },
      phone: { type: String },
      postal_code: { type: String },
      goal: { type: String },
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
