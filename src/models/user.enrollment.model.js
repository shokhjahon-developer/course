const { Schema, model } = require("mongoose");

const enrollmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
});

const Enrollment = model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
