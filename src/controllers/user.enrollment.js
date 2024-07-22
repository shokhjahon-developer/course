const Joi = require("joi");
const Enrollment = require("../models/user.enrollment.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");

const createEnrollment = async (req, res, next) => {
  const { course } = req.body;
  const { userId } = req.params;
  try {
    const check = Joi.object({
      userId: Joi.string().required(),
      course: Joi.string().required(),
    });

    const { error } = check.validate({ userId, course });
    if (error) return res.status(400).json({ message: error.message });

    const existingUser = await User.findById(userId);
    const existingCourse = await Course.findById(course);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const enrollment = await Enrollment.create({ user: userId, course });
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user")
      .populate("course");
    res.json({ message: "Success", data: enrollments });
  } catch (error) {
    next(error);
  }
};

const getEnrollmentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const enrollment = await Enrollment.findById(id)
      .populate("user")
      .populate("course");
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found!" });
    }
    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

const updateEnrollmentById = async (req, res, next) => {
  const { id } = req.params;
  const { course, progress } = req.body;
  try {
    const check = Joi.object({
      course: Joi.string(),
      progress: Joi.object(),
    });

    const { error } = check.validate({ course, progress });
    if (error) return res.status(400).json({ message: error.message });

    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      { course, progress },
      { new: true }
    )
      .populate("user")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found!" });
    }
    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

const deleteEnrollmentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found!" });
    }
    res.json({ message: "Enrollment deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
};
