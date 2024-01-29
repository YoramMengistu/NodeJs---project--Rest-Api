const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleWare/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already Registered");
  }

  const newUser = new User({
    ...req.body,
    password: await bcrypt.hash(req.body.password, 12),
  });

  await newUser.save();
  res.send(_.pick(newUser, ["_id", "name", "email", "biz", "cards"]));
});
router.put("/users/:id", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findByIdAndUpdate({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!user) {
    res.status(400).send("The user with the given ID was not found.");
  }
  res.send(user);
});

router.delete("/users/:id", auth, async (req, res) => {
  const user = await User.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!user) {
    return res.status(400).send("The user with the given ID was not found.");
  }
  res.send(user);
});

module.exports = router;
