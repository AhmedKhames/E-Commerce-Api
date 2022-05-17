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

  if (!req.file) {
    return res.status(422).json({ message: "No Image Provided" });
  }

  const body: ProductCatBody = req.body;
  const name = body.name;
  const imageUrl = req.file.path.replace("\\", "/");
  console.log(imageUrl);
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

const updateCategory = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const catId = req.params.id;

  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body: ProductCatBody = req.body;
  const name = body.name;
  let imageUrl = body.imageUrl;
  const description = body.description;

  if (req.file) {
    clearImage(body.imageUrl);
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    return res.status(422).json({ message: "No Image Provided" });
  }
  try {
    const productCat = await Product_Category.findByPk(catId);
    let updatedCat;
    if (!productCat) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    if (productCat.UserId.toString() === req.userId.toString()) {
      productCat.imageUrl = imageUrl;
      productCat.name = name;
      productCat.description = description;
      updatedCat = await productCat.save();
    }
    if (updatedCat) {
      res.status(200).json({
        message: "Category updated",
        category: updatedCat,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const catId = req.params.id;
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const productCat = await Product_Category.findByPk(catId);
    if (!productCat) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    if (productCat.UserId.toString() === req.userId.toString()) {
      let imagePath = productCat.imageUrl;
      productCat
        .destroy()
        .then((success) => {
          clearImage(imagePath);
          res.status(200).json({
            message: "Category deleted",
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  } catch (error) {
    next(error);
  }
};

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(422).json({ message: "No Image Provided" });
  }

  const body: ProductCatBody = req.body;
  const name = body.name;
  const imageUrl = req.file.path.replace("\\", "/");
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
        .then(() => {
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

const updateProduct = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const productId = req.params.id;

  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body: ProductCatBody = req.body;
  const name = body.name;
  let imageUrl = body.imageUrl;
  const description = body.description;
  const price = body.price;
  const quantity = body.quantity;
  const catName = body.catName;

  if (req.file) {
    clearImage(body.imageUrl);
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    return res.status(422).json({ message: "No Image Provided" });
  }
  try {
    const product = await Product.findByPk(productId);
    let updatedProduct;
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (product.UserId.toString() === req.userId.toString()) {
      product.imageUrl = imageUrl;
      product.name = name;
      product.description = description;
      product.price = price;
      product.quantity = quantity;

      let catId = await Product_Category.findOne({
        where: {
          name: catName,
        },
      });

      product.ProductCategoryId = catId?.id;
      updatedProduct = await product.save();
    }

    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated",
        category: updatedProduct,
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prodId = req.params.id;
  if (!req.isAuth) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    if (product.UserId.toString() === req.userId.toString()) {
      let imagePath = product.imageUrl;
      product
        .destroy()
        .then((success) => {
          clearImage(imagePath);
          res.status(200).json({
            message: "Product deleted",
          });
        })
        .catch((err) => {
          next(err);
        });
    }else{
      res.status(422).json({
        message : "you aren't admin"
      })
    }
  } catch (error) {
    next(error);
  }
};

export {
  createCategory,
  createProduct,
  updateCategory,
  updateProduct,
  deleteCategory,
  deleteProduct,
};
import path from "path";
import fs from 'fs';
const clearImage = (filePath:string) => {
  filePath = path.join(__dirname, "../../", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};