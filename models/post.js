const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

postSchema.virtual("sinceDate").get(function () {
  const duration = (Date.now() - this.date.getTime()) / 1000;
  if (duration < 60) {
    return `${duration.toFixed(0)} seconds ago`;
  } else if (duration < 60 * 60) {
    return `${(duration / 60).toFixed(0)} minutes ago`;
  } else if (duration < 60 * 60 * 24) {
    return `${(duration / (60 * 60)).toFixed(0)} hours ago`;
  } else {
    return `${(duration / (60 * 60 * 24)).toFixed(0)} days ago`
  }
});

module.exports = mongoose.model("Post", postSchema);
