const mongoose = require("mongoose");
const User = require("./models/user.model");

const createAdminUser = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/courses", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.create({
      fullname: "admin",
      phone: "+998930000000",
      password: "adminpassword",
      isAdmin: true,
    });

    console.log("User created:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();
