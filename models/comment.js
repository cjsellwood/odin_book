const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
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
});

commentSchema.set("toObject", { virtuals: true });

commentSchema.virtual("sinceDate").get(function () {
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

module.exports = mongoose.model("Comment", commentSchema)