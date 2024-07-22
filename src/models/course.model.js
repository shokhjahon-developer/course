const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    unique: true,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  lessonsCount: {
    type: String,
    required: true,
  },
});

const Course = model("Course", courseSchema);

module.exports = Course;
