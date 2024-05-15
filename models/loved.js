// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
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
    additional_info: {
      stripe_acc_id: { type: String },
      date_of_birth: { type: Date },
      country: { type: String },
      city: { type: String },
      state: { type: String },
      street_address: { type: String },
      phone: { type: String },
      postal_code: { type: String },
      goal: { type: String },
    },
  },
  { timestamps: true },
);

const Loved = mongoose.models.Loved || mongoose.model("Loved", userSchema);

export default Loved;
