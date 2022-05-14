import express from "express";
import { body, CustomValidator, validationResult } from "express-validator";
import { createCategory, createProduct, deleteCategory, deleteProduct, updateCategory, updateProduct } from "../controllers/admin";
import { signup, login } from "../controllers/auth";
import { Users } from "../models/Users";

const router = express.Router();

router.post(
  "/create-category",
  [
    body("name").not().isEmpty().trim(),
    body("description").not().isEmpty().trim(),
  ],
  createCategory
);
router.post(
  "/create-product",
  [
    body("name").not().isEmpty().trim(),
    body("description").not().isEmpty().trim(),
    body("price").isNumeric().not().isEmpty(),
    body("quantity").isNumeric().not().isEmpty(),
    body("catName").not().isEmpty().trim(),
  ],
  createProduct
);

router.put("/update-category/:id"
// , [
//   body("name").not().isEmpty().trim(),
//   body("imageUrl").not().isEmpty().trim(),
//   body("description").not().isEmpty().trim(),
// ]
,updateCategory);

router.put("/update-product/:id", [
  body("name").not().isEmpty().trim(),
  body("imageUrl").not().isEmpty().trim(),
  body("description").not().isEmpty().trim(),
  body("price").isNumeric().not().isEmpty(),
  body("quantity").isNumeric().not().isEmpty(),
  body("catName").not().isEmpty().trim(),
],updateProduct);

router.delete("/delete-category/:id",deleteCategory);
router.delete("/delete-product/:id",deleteProduct);

export default router;
