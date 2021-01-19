const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization === Bearer ewefwegwrherhe
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  console.log(token);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    const { id } = payload;
    User.findById(id).then((userdata) => {
      req.user = userdata;
      console.log(req.user);
      next();
    });
  });
};
