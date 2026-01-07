import {body , validationResult} from 'express-validator'
import mongoose from 'mongoose';
import {param } from 'express-validator'



function validateResult(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      errors: errors.array(),
    });
  }

  next();
}


export const validateAddItemToCart = [
  body("productId")
    .isString()
    .withMessage("ProductId must be a string ")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid productId format"),
 

    body("quantity")
    .optional()
    .isInt({gt : 0})
    .withMessage("Quantity must be a positive integer"),

  validateResult,
];


export const validateUpdateItemToCart = [
  param("productId")
    .isString()
    .withMessage("ProductId must be a string ")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid productId format"),
 

    body("quantity")
    .optional()
    .isInt({gt : 0})
    .withMessage("Quantity must be a positive integer"),

  validateResult,
];

export const validateDeleteItemToCart = [

  param("productId")
    .isString()
    .withMessage("ProductId must be a string ")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid productId format"),
 

  validateResult,
];