import mongoose from "mongoose";

// Check if the model is already defined
const CustomerActivity = mongoose.models.CustomerActivity || mongoose.model('CustomerActivity', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, required: true },
  ip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

export default CustomerActivity;
