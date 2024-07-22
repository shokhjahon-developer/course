require("dotenv/config");

const cors = require("cors");
const cookie = require("cookie-parser");
const errorHandler = require("../middlewares/error.handler");
const fileUpload = require("express-fileupload");

const authRoute = require("../routes/auth.route");
const coursesRoute = require("../routes/courses.route");
const lessonsRoute = require("../routes/lessons.route.js");
const userEnrollmentRoute = require("../routes/user.enrollment");
const adminRoute = require("../routes/admin.route.js");

const modules = (app, express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(fileUpload());
  app.use(express.static(`${process.cwd()}/src/uploads`));

  app.use(cors());
  app.use(cookie());

  app.use("/api/auth", authRoute);
  app.use("/api/courses", coursesRoute);
  app.use("/api/lessons", lessonsRoute);
  app.use("/api/enrollment", userEnrollmentRoute);
  app.use("/api/admin", adminRoute);

  app.use(errorHandler);
};

module.exports = modules;
