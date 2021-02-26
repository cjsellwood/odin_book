const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  avatarUrl: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  birthDate: {
    type: Date,
  },
  friendRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.set('toObject', { virtuals: true });

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
})

module.exports = mongoose.model("User", userSchema);
