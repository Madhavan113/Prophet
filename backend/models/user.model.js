// models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {  // new field for email
    type: String, 
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  portfolio_api_url: {
    type: String,
    default: ''
  },
  prophet_coin_balance: {
    type: Number,
    default: 0
  },
  verified: {  // whether the email is verified
    type: Boolean,
    default: false
  },
  verificationCode: {  // 6-digit code sent to email
    type: String
  },
  resetToken: {  // optional for password reset
    type: String
  },
  resetTokenExpiry: {  // optional expiry date/time for reset token
    type: Date
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
