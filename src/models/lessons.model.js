const { Schema, model } = require("mongoose");

const lessonsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  video: {
    type: String,
    required: true,
  },
});

const Lesson = model("Lesson", lessonsSchema);

module.exports = Lesson;
