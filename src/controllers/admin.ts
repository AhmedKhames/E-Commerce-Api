import { Users } from "../models/Users";
import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { constants } from "fs";
import jwt, { Jwt } from "jsonwebtoken";
import { isAuth } from "../middleware/isAuth";
import { Product_Category } from "../models/Product_Category";
import { Product } from "../models/Product";

interface ProductCatBody {
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  quantity: number;
  catName: string;
}

const createCategory = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body: ProductCatBody = req.body;
  const name = body.name;
  const imageUrl = body.imageUrl;
  const description = body.description;

  Product_Category.create({
    name: name,
    imageUrl: imageUrl,
    description: description,
    UserId: req.userId,
  })
    .then((prodCat) => {
      res.status(201).json({
        message: "product Created Successfully",
        productCategory: prodCat,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const updateCategory = (req: Request, res: Response, next: NextFunction) => {
  const catId = req.params.catId;
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body: ProductCatBody = req.body;
  const name = body.name;
  const imageUrl = body.imageUrl;
  const description = body.description;

  // if (req.file) {
  //     imageUrl = req.file.path;
  //   }
  //   if (!imageUrl) {
  //     const error = new Error("No file picked.");
  //     error.statusCode = 422;
  //     throw error;
  //   }

  Product_Category.findByPk(catId)
    //   .then(catPk=>{
    // if (!catPk) {
    //     return res.status(404).json({ message: "Product Not Found" });
    //   }
    //   }).then((cat) => {
    .then((cat) => {
      if (cat) {
        if (cat.UserId.toString() === req.userId) {
          // return res.status(401).json({ message: "You should be the admin" });
          cat.imageUrl = imageUrl;
          cat.name = name;
          cat.description = description;
          return cat.save();
        }
      }
    })
    .then((category) => {
      if (category) {
        res.status(200).json({
          message: "Category updated",
          category: category,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCategory = (req: Request, res: Response, next: NextFunction) => {};

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body: ProductCatBody = req.body;
  const name = body.name;
  const imageUrl = body.imageUrl;
  const description = body.description;
  const price = body.price;
  const quantity = body.quantity;

  Product.create({
    name: name,
    imageUrl: imageUrl,
    description: description,
    price: price,
    quantity: quantity,
    UserId: req.userId,
  })
    .then((prod) => {
      Product_Category.findOne({
        where: {
          name: body.catName,
        },
      })
        .then((catId) => {
          prod.update({
            ProductCategoryId: catId?.id,
          });
        })
        .then((upProduct) => {
          res.status(201).json({
            message: "product Created Successfully",
            product: prod,
          });
        });
    })
    .catch((err) => {
      next(err);
    });
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {};

export {
  createCategory,
  createProduct,
  updateCategory,
  updateProduct,
  deleteCategory,
  deleteProduct,
};
