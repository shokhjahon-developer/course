const { Router } = require("express");
const {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
} = require("../controllers/user.enrollment");
const isAuth = require("../middlewares/is-auth");

const router = Router();

router.post("/:userId", isAuth, createEnrollment);
router.get("/", isAuth, getAllEnrollments);
router.get("/:id", isAuth, getEnrollmentById);
router.put("/:id", isAuth, updateEnrollmentById);
router.delete("/:id", isAuth, deleteEnrollmentById);

module.exports = router;
