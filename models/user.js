import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      default: uuidv4, // Automatically generate a unique ID
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      sparse: true, // Allow multiple documents with null email
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      unique: true, // Ensure phone number is unique
    },
    page: { type: mongoose.Schema.ObjectId, ref: "Loved" },
    additional_info: {
      stripe_acc_id: { type: String },
      date_of_birth: { type: Date },
      country: { type: String },
      currency: { type: String },
      city: { type: String },
      state: { type: String },
      street_address: { type: String },
      postal_code: { type: String },
      goal: { type: String },
    },
  },
  { timestamps: true },
);

// Create a compound index for email
userSchema.index({ phone: 1 }, { unique: true, sparse: true, partialFilterExpression: { phone: { $exists: true, $ne: null } } });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
