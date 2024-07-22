const { Router } = require("express");
const isAdmin = require("../middlewares/is-admin");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
} = require("../controllers/courses.controller");

const router = Router();

router.post("/", isAdmin, createCourse);
router.get("/:id", getCourseById);
router.get("/", getAllCourses);
router.put("/:id", isAdmin, updateCourseById);
router.delete("/:id", isAdmin, deleteCourseById);

module.exports = router;
