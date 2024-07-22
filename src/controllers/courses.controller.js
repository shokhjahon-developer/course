const path = require("path");
const { v4: uuid } = require("uuid");
const Joi = require("joi");
const Course = require("../models/course.model");
const Lesson = require("../models/lessons.model"); // Import the Lesson model

const createCourse = async (req, res, next) => {
  const { title, description } = req.body;
  const { photo } = req.files;
  try {
    const check = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      photo: Joi.required(),
    });

    const { error } = check.validate({ title, description, photo });
    if (error) return res.status(400).json({ message: error.message });

    const photoName = `${uuid()}${path.extname(photo.name)}`;
    photo.mv(`${process.cwd()}/src/uploads/${photoName}`);

    const course = await Course.create({
      title,
      description,
      photo: photoName,
      lessonsCount: 0, 
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.json({ message: "Success", data: courses });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

const updateCourseById = async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const { photo } = req.files;
  try {
    const check = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      photo: Joi.required(),
    });

    const { error } = check.validate({ title, description, photo });
    if (error) return res.status(400).json({ message: error.message });

    const photoName = photo
      ? `${uuid()}${path.extname(photo.name)}`
      : undefined;
    if (photoName) {
      photo.mv(`${process.cwd()}/src/uploads/${photoName}`);
    }

    const updateFields = { title, description };
    if (photoName) {
      updateFields.photo = photoName;
    }

    const course = await Course.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
};

const deleteCourseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Remove all lessons associated with the course
    await Lesson.deleteMany({ course: id });

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }
    res.json({ message: "Course deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
};
