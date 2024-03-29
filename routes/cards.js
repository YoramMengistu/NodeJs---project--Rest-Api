const express = require("express");
const _ = require("lodash");
const { Card, validateCard, generateBizNumber } = require("../models/card");
const auth = require("../middleWare/auth");
const router = express.Router();

router.get("/:id", auth, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    return res.status(400).send("The card with the given ID was not found.");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let card = new Card({
    bizName: req.body.bizName,
    bizDescription: req.body.bizDescription,
    bizAddress: req.body.bizAddress,
    bizPhone: req.body.bizPhone,
    bizImage: req.body.bizImage
      ? req.body.bizImage
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    bizNumber: await generateBizNumber(Card),
    user_id: req.body.user_id,
  });
  let post = await card.save();
  res.send(post);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const card = await Card.findByIdAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!card) {
    return res.status(400).send("The card with the given ID was not found.");
  }
  res.send(card);
});

router.delete("/:id", auth, async (req, res) => {
  const card = Card.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    return res.status(400).send("The card with the given ID was not found.");
  }
  res.send(card);
});

module.exports = router;
