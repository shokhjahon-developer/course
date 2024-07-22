const { Router } = require("express");
const {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
} = require("../controllers/user.enrollment");

const router = Router();

router.post("/:userId", createEnrollment);
router.get("/", getAllEnrollments);
router.get("/:id", getEnrollmentById);
router.put("/:id", updateEnrollmentById);
router.delete("/:id", deleteEnrollmentById);

module.exports = router;
