const Joi = require("joi");
const path = require("path");
const { v4: uuid } = require("uuid");
const Lesson = require("../models/lessons.model");
const Course = require("../models/course.model");

const updateLessonsCount = async (courseId) => {
  const lessonsCount = await Lesson.countDocuments({ course: courseId });
  await Course.findByIdAndUpdate(courseId, { lessonsCount });
};

const createLesson = async (req, res, next) => {
  const { title, course } = req.body;
  const { video } = req.files;

  try {
    if (!video) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const check = Joi.object({
      title: Joi.string().required(),
      course: Joi.string().required(),
      video: Joi.required(),
    });

    const { error } = check.validate({ title, course, video });
    if (error) return res.status(400).json({ message: error.message });

    const videoName = `${uuid()}${path.extname(video.name)}`;
    video.mv(`${process.cwd()}/src/uploads/${videoName}`, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "File upload failed", error: err });
      }
    });

    const lesson = await Lesson.create({ title, video: videoName, course });

    await updateLessonsCount(course);

    res.status(201).json(lesson);
  } catch (error) {
    next(error);
  }
};

const getAllLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().populate("course");
    res.json({ message: "Success", data: lessons });
  } catch (error) {
    next(error);
  }
};

const getLessonById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const lesson = await Lesson.findById(id).populate("course");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found!" });
    }
    res.json(lesson);
  } catch (error) {
    next(error);
  }
};

const updateLessonById = async (req, res, next) => {
  const { id } = req.params;
  const { title, course } = req.body;
  const { video } = req.files;

  try {
    const check = Joi.object({
      title: Joi.string(),
      course: Joi.string(),
      video: Joi.required(),
    });

    const { error } = check.validate({ title, course, video });
    if (error) return res.status(400).json({ message: error.message });

    const updateFields = { title, course };
    if (video) {
      const videoName = `${uuid()}${path.extname(video.name)}`;
      video.mv(`${process.cwd()}/src/uploads/${videoName}`, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "File upload failed", error: err });
        }
      });
      updateFields.video = videoName;
    }

    const lesson = await Lesson.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found!" });
    }

    if (course) {
      await updateLessonsCount(course);
    }

    res.json(lesson);
  } catch (error) {
    next(error);
  }
};

const deleteLessonById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found!" });
    }

    await updateLessonsCount(lesson.course);

    res.json({ message: "Lesson deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLessonById,
  deleteLessonById,
};
