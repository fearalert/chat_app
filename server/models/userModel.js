const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
        match: [/.+@.+\..+/, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 32,
      },
      isAvatarImageSet: {
        type: Boolean,
        default: false,
      },
      avatarImage: {
        type: String,
        default: "",
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      OTP_VerificationToken: {
        OTP: String,
        expires: Date,
      },
      refreshToken: {
        type: String,
      },
});

module.exports = mongoose.model("Users", userSchema);