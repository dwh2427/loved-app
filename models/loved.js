// models/User.js

import mongoose from "mongoose";

const lovedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    uid: {
      type: String,
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
    page_name: {
      type: String,
    },
    story: { type: String },
    pageFor: {
      type: String,
      enum: ["friend", "family_member", "yourself"],
      required: true,
    },
    additional_info: {
      type: Object,
    },
    stripe_acc_id: String,
    images: [{ type: String }],
    currency: { type: String, required: true },
    // country: { type: String, required: true },
    // is_identity_submitted: { type: Boolean, default: false },
    // is_bank_details_submitted:{type:Boolean,default:false}
    // status: { type: String, enum: ["verified", "unverified"] },
  },
  { timestamps: true },
);

const Loved = mongoose.models.Loved || mongoose.model("Loved", lovedSchema);

export default Loved;
