import { Users } from "../models/Users";
import express from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { constants } from "fs";
import jwt, { Jwt } from "jsonwebtoken";
import { isAuth } from "../middleware/isAuth";
import { Cart } from "../models/Cart";
import { UserAddresses } from "../models/UserAddresses";
import { UserPhones } from "../models/UserPhones";

require("dotenv").config();

interface BodyData {
  name: string;
  password: string;
  email: string;
  address?: string;
  phoneNumber?: string;
}

const signup = async function (
  req: express.Request,
  res: express.Response,
  next: any
) {
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

  try {
    let hashedPassword = await bcrypt.hash(password, 12);

    const user = await Users.create({
      name: name,
      password: hashedPassword,
      email: email,
    });
    if (address) {
      const addresses = await UserAddresses.create({
        address: address,
        UserId: user.id,
      });
      user.addressId = addresses.id;
    }
    if (phoneNumber) {
      const phones = await UserPhones.create({
        phoneNumber: phoneNumber,
        UserId: user.id,
      });
      user.phoneNumberId = phones.id;
    }
    await user.save();

    await Cart.create({
      UserId: user.id,
    });
    res.status(201).json({
      message: "User created",
      userId: user.id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "creation error",
    });
  }

  // bcrypt
  //   .hash(password, 12)
  //   .then((hashedPassword) => {
  //     const user =  Users.create({
  //       name: name,
  //       password: hashedPassword,
  //       email: email,
  //     })
  //     // .then(userUp=>{
  //     //   if (address) {
  //     //     const addresses = UserAddresses.create({
  //     //       address:address,
  //     //       UserId:userUp.id
  //     //     })
  //     //   }
  //     //   if (phoneNumber) {

  //     //   }
  //     // });

  //     return user;
  //   })
  //   .then((result) => {
  //     Cart.create({
  //       UserId:result.id
  //     }).then(createdUser=>{
  //       res.status(201).json({
  //         message: "User created",
  //         userId: createdUser.UserId,
  //       });
  //     })
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({
  //       message: "creation error",
  //     });
  //   });
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

export { signup, login };
