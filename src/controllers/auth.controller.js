const { createToken } = require("../utils/jwt");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const verify = Joi.object({
      phone: Joi.string().required(),
      password: Joi.string().min(12).required(),
    });

    const { error } = verify.validate({ phone, password });
    if (error) return res.status(400).json({ message: error.message });

    const findUser = await User.findOne({ phone: phone });

    if (!findUser) {
      return res.status(403).json({ message: "Incorrect password or email!" });
    }

    const check = await bcrypt.compare(password, findUser.password);

    if (!check) {
      return res.status(403).json({ message: "Incorrect password or email!" });
    }

    const token = createToken({ id: findUser.id, isAdmin: findUser.isAdmin });
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

    const check = Joi.object({
      fullname: Joi.string().min(6).required(),
      phone: Joi.number().required(),
      password: Joi.string().min(12).required(),
    });

    const { error } = check.validate({
      fullname,
      phone,
      password,
    });

    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ phone: phone });

    if (user) {
      return res
        .status(403)
        .json({ message: "You have already registered with this email!" });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullname,
      phone,
      password: hashedPass,
    });

    const token = createToken({
      id: newUser.id,
      isAdmin: newUser.isAdmin,
    });
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
