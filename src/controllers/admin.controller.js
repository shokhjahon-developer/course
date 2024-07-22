const { createToken } = require("../utils/jwt");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const schema = Joi.object({
      phone: Joi.string().required(),
      password: Joi.string().min(12).required(),
    });

    const { error } = schema.validate({ phone, password });
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(403).json({ message: "Incorrect phone or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect phone or password!" });
    }

    const token = createToken({ id: user.id, isAdmin: user.isAdmin });
    res.cookie("token", token);

    res.json({ message: "You are successfully logged in!", data: token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { fullname, phone, password } = req.body;
    const schema = Joi.object({
      fullname: Joi.string().min(6).required(),
      phone: Joi.string().required(),
      password: Joi.string().min(12).required(),
    });

    const { error } = schema.validate({ fullname, phone, password });
    if (error) return res.status(400).json({ message: error.message });

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(403).json({
        message: "You have already registered with this phone number!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      fullname,
      phone,
      password: hashedPassword,
      isAdmin: true,
    });

    const token = createToken({ id: newUser.id, isAdmin: newUser.isAdmin });
    res.cookie("token", token);

    res.status(201).json({ message: "Success", data: token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  register,
  login,
};
