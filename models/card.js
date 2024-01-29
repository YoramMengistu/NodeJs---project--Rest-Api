const mongoose = require("mongoose");
const joi = require("joi");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  bizDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  bizAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400,
  },
  bizPhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  bizImage: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true,
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Card = mongoose.model("Card", cardSchema, "cards");

function validateCard(card) {
  const schema = joi.object({
    bizName: joi.string().min(2).max(255).required(),
    bizDescription: joi.string().min(2).max(1024).required(),
    bizAddress: joi.string().min(2).max(400).required(),
    bizPhone: joi
      .string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    bizImage: joi.string().min(11).max(1024),
  });
  return schema.validate(card);
}

async function generateBizNumber(card) {
  let randomNum = _.random(1000, 999999);
  let cardInModels = await Card.findOne({ bizNumber: randomNum });
  if (!cardInModels) {
    return String(randomNum);
  }
}

module.exports = {
  Card,
  validateCard,
  generateBizNumber,
};
