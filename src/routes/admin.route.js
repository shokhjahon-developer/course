const { Router } = require("express");
const { register, login } = require("../controllers/admin.controller");
const isAdmin = require("../middlewares/is-admin");

const router = Router();

router.post("/register", isAdmin, register);
router.post("/login", isAdmin, login);

module.exports = router;
