const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../keys");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/requirelogin");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  const { ContentType } = req.headers;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please  add all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User Already exists." });
      } else {
        bcrypt
          .hash(password, 12) //more bigger no more stronger password
          .then((hashedpassword) => {
            const user = new User({
              email: email,
              password: hashedpassword,
              name: name,
              pic: pic,
            });
            user
              .save()
              .then((user) => {
                res.status(200).json({ message: "saved successfully" });
              })
              .catch((err) => {
                console.log(err);
                throw err;
              });
          });
      }
    })
    .catch((err) => {
      throw err;
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please  add all the fields" });
  } else {
    User.findOne({ email: email })
      .then((saveduser) => {
        if (!saveduser) {
          return res.status(422).json({ error: "Invalid Email or password" });
        } else {
          bcrypt
            .compare(password, saveduser.password)
            .then((doMatch) => {
              if (doMatch) {
                // res.status(200).json({message:"Successfull"})
                const token = jwt.sign({ id: saveduser._id }, JWT_SECRET);
                const {
                  _id,
                  name,
                  email,
                  followers,
                  following,
                  pic,
                } = saveduser;
                res.status(200).json({
                  message: "Successfull",
                  token: token,
                  user: {
                    _id,
                    name,
                    email,
                    followers,
                    following,
                    pic,
                  },
                });
              } else {
                return res
                  .status(422)
                  .json({ error: "Invalid Email or password" });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:"successfully signed in"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email } = savedUser;

          res.status(200).json({
            message: "Successfull",
            token: token,
            user: {
              _id,
              name,
              email,
            },
          });
        } else {
          return res.status(422).json({ error: "Invalid Email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/reset-password", (req, res) => {
  var transporter = nodemailer.createTransport({
    // service: 'gmail',//smtp.gmail.com  //in place of service use host...

    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cbf43c1cd6a55a",
      pass: "d15cbed5a3260a",
    },
  });
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User dont exists with that email" });
      }

      user.resetToken = token;
      user.expireToken = Date.now() + 3600000; //1 hour
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "no-replay@insta.com",
          subject: "password reset",
          html: `
                  <p>You requested for password reset</p>
                  <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                  `,
        });
        res.json({ message: "check your email" });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: "password updated success" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/forgot", function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            req.flash("error", "No account with that email address exists.");
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "learntocodeinfo@gmail.com",
            pass: process.env.GMAILPW,
          },
        });
        var mailOptions = {
          to: user.email,
          from: "learntocodeinfo@gmail.com",
          subject: "Node.js Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log("mail sent");
          req.flash(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

router.post("/reset", function (req, res) {
  User.findOne({ email: req.body.email }, function (error, userData) {
    if (userData == null) {
      return res.status(404).json({
        success: false,
        msg: "Email is not register",
      });
    }
    var transporter = nodemailer.createTransport({
      // service: 'gmail',//smtp.gmail.com  //in place of service use host...

      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "cbf43c1cd6a55a",
        pass: "d15cbed5a3260a",
      },
    });
    var currentDateTime = new Date();
    var mailOptions = {
      from: "vyash5075official@gmail.com",
      to: req.body.email,
      subject: "Password Reset",
      // text: 'That was easy!',
      html:
        "<h1> Instagram Password your Reset ! </h1><p>\
          <h3>Hello " +
        userData.name +
        "</h3>\
          If You are requested to reset your password then click on below link<br/>\
          <a href='http://localhost:3000/reset/" +
        currentDateTime +
        "+++" +
        userData.email +
        "'>Click On This Link</a>\
          </p>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        User.updateOne(
          { email: userData.email },
          {
            token: currentDateTime,
          },
          { multi: true },
          function (err, affected, resp) {
            return res.status(200).json({
              success: false,
              msg: info.response,
              userlist: resp,
            });
          }
        );
      }
    });
  });
});

module.exports = router;
