import { Users } from "../models/Users";
import express from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { constants } from "fs";
import jwt, { Jwt } from "jsonwebtoken";
import { isAuth } from "../middleware/isAuth";

require("dotenv").config();

interface BodyData {
  name: string;
  password: string;
  email: string;
  address?: string;
  phoneNumber?: string;
}

const signup = (req: express.Request, res: express.Response, next: any) => {
  
  // if (!req.isAuth) {
  //   return res.status(401).json({ message :"Unauthorized" });
  // }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = req.body as BodyData;
  const name: string = body.name;
  const email: string = body.email;
  const password: string = body.password;
  const address: string | undefined = body.address;
  const phoneNumber: string | undefined = body.phoneNumber;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user =  Users.create({
        name: name,
        password: hashedPassword,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
      });
      return user;
    })
    .then((result) => {
      res.status(201).json({
        message: "User created",
        userId: result.id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "creation error",
      });
    });
};

const login = (req: express.Request, res: express.Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = req.body as BodyData;

  const email = body.email;
  const password = body.password;
  let loadedUser: Users | null;

  Users.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isFound) => {
      if (!isFound) {
        const error = new Error("wrong password");
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser?.email,
          userId: loadedUser?.id,
        },
        process.env.JWT_SECRET?.toString() as jwt.Secret,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token: token,
        userId: loadedUser?.id,
      });
    })
    .catch((err) => {
    //   console.log(err);
      next(err);
    });
};

export { signup,login };