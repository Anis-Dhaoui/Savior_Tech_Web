const express = require('express');
const db = require('../models');
const userRouter = express.Router();
var auth = require('../auth');
var bcrypt = require("bcryptjs");
userRouter.use(express.json());
var sendEmail = require('../utils/email');
const { Op } = require("sequelize");

// /users/ api endpoint
userRouter.get('/', (req, res, next) => {
  db.Users.findAll({ include: db.Roles })
    .then((users) => {
      if (users !== null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      } else {
        err = new Error("Users collection is empty");
        next(err);
      }
    },
      err => next(err))
    .catch(err => next(err))
});
//☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠ DANGER ZONE ☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠
userRouter.delete('/', (req, res, next) => {
  db.Users.destroy({ where: {} })
    .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, message: " All users deleted successfully", deletedUser: user });
    },
      err => next(err))
    .catch(err => next(err))
});
//☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠ DANGER ZONE ☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠






// $$$$$$$$$$$$$$$$$$$ SIGNUP $$$$$$$$$$$$$$$$$$$
userRouter.post('/signup', (req, res, next) => {
  db.Users.findOne({ where: { [Op.or]: [{ username: req.body.username }, { email: req.body.email }] }, raw: true })
    .then((user) => {
      if (user && user.username == req.body.username) {
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "Username is already exists" });

      } else if (user && user.email == req.body.email) {
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "Email is already exists" });

      } else {
        const confirCode = auth.getToken({ email: req.body.email });
        db.Users.create({
          fullName: req.body.fullName,
          avatar: req.body.avatar,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),
          email: req.body.email,
          domain: req.body.domain,
          interest: req.body.interest,
          speciality: req.body.speciality,
          confirEmailCode: confirCode,
          RoleId: req.body.RoleId
        })
          .then((user) => {

            const message =
              `<div>
              <h1>Email Confirmation</h1>
              <h2>Hello ${req.body.fullName}</h2>
              <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href=${process.env.BASE_URL}/users/verify/${confirCode}> Click here</a>
            </div>`
            sendEmail(req.body.email, "SAVIOR TECH | Confirm Email", message);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, message: "Signup successfully", user: user });
          },
            err => next(err))
      }
    },
      err => next(err))
    .catch(err => next(err))
});
// $$$$$$$$$$$$$$$$$$$ SIGNUP $$$$$$$$$$$$$$$$$$$


// $$$$$$$$$$$$$$$$$$$ SIGNIN $$$$$$$$$$$$$$$$$$$
userRouter.post('/signin', (req, res, next) => {
  db.Users.findOne({ where: { username: req.body.username }, include: db.Roles, raw: true, nest: true })
    .then((user) => {
      if (!user) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "username does not exist" });

      } else if (user.status === "pending") {
        res.statusCode = 202;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "Please verify your email" });

      } else if (user.status === "blocked") {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "Your account has been blocked" });

      } else {
        var isPassValid = bcrypt.compareSync(req.body.password, user.password);

        if (!isPassValid) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: false, statusMsg: "incorrect password" });

        } else {
          var generatedToken = auth.getToken({ id: user.id });

          //gather information of the authenticated user
          var info = {
            id: user.id,
            fullName: user.fullName,
            avatar: user.avatar,
            username: user.username,
            email: user.email,
            domain: user.domain,
            interest: user.interest,
            speciality: user.speciality,
            role: user.Role.roleName,
            admin: user.admin,
            status: user.status
          };

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            statusMsg: "login success",
            token: generatedToken,
            userInfo: info
          });
        }
      }
    })
});
// $$$$$$$$$$$$$$$$$$$ SIGNIN $$$$$$$$$$$$$$$$$$$




// /users/userId api endpoint
userRouter.route('/:userId')
  .put(auth.verifyToken, (req, res, next) => {
    db.Users.update(req.body, { where: { id: req.user.id } })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, message: "User updated successfully", updatedUser: user });
      },
        err => next(err))
      .catch(err => next(err))
  })

  .delete(auth.verifyToken, (req, res, next) => {
    db.Users.destroy({ where: { id: req.user.id } })
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, message: "User deleted successfully", deletedUser: user });
      },
        err => next(err))
      .catch(err => next(err))
  });

module.exports = userRouter;