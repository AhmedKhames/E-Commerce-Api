import express from "express";
import { body, CustomValidator, validationResult } from "express-validator";
import { signup, login } from "../controllers/auth";
import { Users } from "../models/Users";


const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter valid email"),
    body("password").isLength({ min: 6 }),
  ],
  login
);

const isValidUser: CustomValidator = (value) => {
  return Users.findAll({
    where: {
      email: value,
    },
  }).then((user) => {
    if (user.length > 0) {
      return Promise.reject("Email is already exists");
    }
  });
};

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Enter valid email")
      .custom(isValidUser),
    body("name").isLength({ min: 1 }),
    body("password").isLength({ min: 6 }),
  ],

  signup
);

export default router;
