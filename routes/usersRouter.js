const express = require('express');
const db = require('../models');
const userRouter = express.Router();
var auth = require('../auth');
var bcrypt = require("bcryptjs");
var codeGenerator = require('generate-sms-verification-code')
userRouter.use(express.json());
var sendEmail = require('../utils/email');
var sendSms = require('../utils/sms');
const { Op, where } = require("sequelize");
const shortUUID = require('short-uuid');
const fs = require('fs');


// /users/ api endpoint
userRouter.get('/chunk/:chunknbr', (req, res, next) => {
  const limit = 3;
  db.Users.findAll({
    offset: (req.params.chunknbr - 1) * limit,
    limit: limit,

    attributes: { exclude: ['RoleId'] },
    include: {
      model: db.Roles,
      attributes: ['roleName']
    }
  })
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
        const smsConfirCode = codeGenerator(6, { type: 'number' });



        if (!req.files) {
          db.Users.create({
            fullName: req.body.fullName,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            email: req.body.email,
            phone: req.body.phone,
            domain: req.body.domain,
            interest: req.body.interest,
            speciality: req.body.speciality,
            confirResetPassCode: confirCode,
            confirSmsCode: smsConfirCode,
            RoleId: req.body.RoleId
          })
            .then((user) => {
              const message =
                `<div>
            <h1>Email Confirmation</h1>
            <h2>Hello ${req.body.fullName}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=${process.env.BASE_URL}/users/verify/${user.dataValues.id}/${confirCode}> Click here</a>
          </div>`
              sendEmail(req.body.email, "SAVIOR TECH | Confirm Email", message);

              // sendSms(req.body.phone, smsConfirCode);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: true, message: "Signup successfully", user: user });
            },
              err => next(err))
        } else {
          var image = req.files.image;
          var avatar = `${shortUUID.generate()}.${image.mimetype.split('/')[1]}`;
          if (image.mimetype == "image/jpeg" || image.mimetype == "image/png" || image.mimetype == "image/gif") {
            image.mv('public/images/upload/users/' + avatar, (err) => {
              if (err) {
                next(err)
              } else {
                db.Users.create({
                  fullName: req.body.fullName,
                  username: req.body.username,
                  password: bcrypt.hashSync(req.body.password, 8),
                  email: req.body.email,
                  avatar: avatar,
                  phone: req.body.phone,
                  domain: req.body.domain,
                  interest: req.body.interest,
                  speciality: req.body.speciality,
                  confirResetPassCode: confirCode,
                  confirSmsCode: smsConfirCode,
                  RoleId: req.body.RoleId
                })
                  .then((user) => {
                    const message =
                      `<div>
                  <h1>Email Confirmation</h1>
                  <h2>Hello ${req.body.fullName}</h2>
                  <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                  <a href=${process.env.BASE_URL}/users/verify/${user.dataValues.id}/${confirCode}> Click here</a>
                </div>`
                    sendEmail(req.body.email, "SAVIOR TECH | Confirm Email", message);

                    // sendSms(req.body.phone, smsConfirCode);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, message: "Signup successfully", user: user });
                  },
                    err => next(err))
              }
            })
          }

        }

      }
    },
      err => next(err))
    .catch(err => next(err))
});
// $$$$$$$$$$$$$$$$$$$ SIGNUP $$$$$$$$$$$$$$$$$$$

// $$$$$$$$$$$$$$$$$$$ VERIFY EMAIL $$$$$$$$$$$$$$$$$$$ /fhjjh/65285926
userRouter.get('/verify/:userId/:confirCode', (req, res, next) => {
  db.Users.update(
    { confirResetPassCode: null, status: "confirmed" }, 
    { where: { [Op.and]: [{ id: req.params.userId }, { confirResetPassCode: req.params.confirCode }] } }
  )
    .then((user) => {
      if (user[0] !== 0) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, statusMsg: "Account verified successfully" });
        console.log("Account verified successfully");

      } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "Invalid confirmation link" });
        console.log("invalid link");
      }
    },
      err => next(err))
    .catch(() => next(new Error("Something went wrong")));
});
// $$$$$$$$$$$$$$$$$$$ VERIFY EMAIL $$$$$$$$$$$$$$$$$$$


// $$$$$$$$$$$$$$$$$$$ VERIFY SMS $$$$$$$$$$$$$$$$$$$
userRouter.get('/verifysms/:smsCode', (req, res, next) => {
  db.Users.update(
    { confirSmsCode: null, status: "confirmed" },
    { where: { confirSmsCode: req.params.smsCode } }
  )
    .then((user) => {
      if (user[0] !== 0) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, statusMsg: "Account verified successfully" });
        console.log("Account verified successfully");

      } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "Invalid confirmation code" });
        console.log("invalid link");
      }
    },
      err => next(err))
    .catch(() => next(new Error("Something went wrong")));
});
// $$$$$$$$$$$$$$$$$$$ VERIFY SMS $$$$$$$$$$$$$$$$$$$


// $$$$$$$$$$$$$$$$$$$ SIGNIN $$$$$$$$$$$$$$$$$$$
userRouter.post('/signin', (req, res, next) => {
  db.Users.findOne({
    where: { username: req.body.username },
    include: db.Roles,
    raw: true,
    nest: true
  })
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

  .delete(auth.verifyToken, auth.verifyAdmin, (req, res, next) => {
    db.Users.findOne({ where: { id: req.params.userId }, raw: true })
      .then((user) => {
        if (user.avatar != null) {
          var pathImage = `public/images/upload/users/${user.avatar}`;

          if (fs.existsSync(pathImage)) {
            fs.unlink(pathImage, err => {
              if (err) next(err);
            });
          } else {
            console.log("image doesn't exist");
          }
        }
      },
        err => next(err))
      .catch(err => next(err))
    db.Users.destroy({ where: { id: req.params.userId } })
      .then((user) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, message: "User deleted successfully", deletedUser: user });
      },
        err => next(err))
      .catch(err => next(err))




  });







//$$$$$$$$$$$$$$$$$$$$$$$$// RESET PASSWORD //$$$$$$$$$$$$$$$$$$$$$$$$//
userRouter.post('/forgotpassword/sendlink', (req, res, next) => {
  db.Users.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, statusMsg: 'Email not found' });
      }
      else if (user.status != "confirmed") {
        return res.status(403).json({ success: false, statusMsg: 'This account is not verified yet! Please verify your email first.' });
      }
      else {
        const confirResetPasswordCode = auth.getToken({ email: user.email });

        db.Users.update(
          { confirResetPassCode: confirResetPasswordCode },
          { where: { email: user.email } }
        ).then(() => {
          const message =
            `<div>
          <h1>Email Reset Password</h1>
          <h2>Hello ${user.fullName}</h2>
          <p>You or someone else requested to reset your password, if it was you, please click the link below to reset your password, othwise ignore this email</p>
          <a href= ${process.env.BASE_URL}/users/forgotpassword/resetpassword/${user.id}/${confirResetPasswordCode}> Click here</a>
        </div>`
          sendEmail(user.email, "SAVIOR TECH | Reset Password", message)
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, statusMsg: "Reset password link sent successfully to " + user.email });
//http://localhost:3000/users/forgotpassword/resetpassword/74bb4723-e580-4fb8-bfcb-4a2ebf9bfc0e/eyJhbGciOiJ
        }, err => next(err))
      }
    })
})

userRouter.get('/forgotpassword/resetpassword/:userId/:confirPassCode', (req, res, next) => {
  db.Users.update(
    { confirResetPassCode: null, password : bcrypt.hashSync(req.body.newPassword, 8)  }, 
    { where: { [Op.and]: [{ id: req.params.userId }, { confirResetPassCode: req.params.confirPassCode }] } }
  )
    .then((user) => {
      if (user[0] !== 0) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, statusMsg: "Password changed successfully" });
        

      } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: false, statusMsg: "Invalid confirmation link" });
        console.log("invalid link");
      }
    },
      err => next(err))
    .catch(() => next(new Error("Something went wrong")));
});
module.exports = userRouter;