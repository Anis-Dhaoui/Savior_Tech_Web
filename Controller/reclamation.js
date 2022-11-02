const Models = require("./../models");
const nodemailer = require("nodemailer");
const Reclamation = Models.Reclamation;
const User = Models.User;

exports.addReclamation = async (req, res) => {
  var new_reclamation = {
    object: req.body.object,
    message: req.body.message,
    statut: false,
    ownerId: req.profile.id,
  };

  let reclamation = await Reclamation.create(new_reclamation)
    .then((rec) => {
      res.status(200).json({ message: "Reclamation susscefully saved !", rec });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};

exports.reclamationsByUser = (req, res) => {
  Reclamation.findAll({ where: { ownerId: req.profile.id } })
    .then((reclamations) => {
      res.status(200).json({ reclamations });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rezgui.houssem@esprit.tn",
    pass: "E09920752", // naturally, replace both with your real credentials or an application-specific password
  },
});

exports.traiterReclamation = async (req, res) => {
  const isAdmin = req.profile.role == "admin";
  if (!isAdmin) {
    return res.status(403).json({
      error: "You are  not authorized to perform this action !",
    });
  }
  let reclamation = req.reclamation;
  if (reclamation.statut == true) {
    return res.status(400).json({
      error: "You have already approved this reclamation !",
    });
  }
  reclamation.update({ statut: true });

  let user = await User.findOne({ where: { id: reclamation.ownerId } });

  const mailOptions = {
    from: "ahmed.dhambri@esprit.tn",
    to: user.email,
    subject: "Réclamation",
    text: "Votre réclamation est traité",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  reclamation
    .save()
    .then((rec) => {
      res
        .status(200)
        .json({ message: "reclamation approved successfully", rec });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};
exports.reclamationById = (req, res, next, id) => {
  Reclamation.findOne({ where: { id: id } }).then((reclamation) => {
    if (!reclamation) {
      return res.status(400).json({
        error: "reclamation not found !",
      });
    }
    req.reclamation = reclamation;
    next();
  });
};
exports.getAllReclamations = (req, res) => {
  const isAdmin = req.profile.role == "admin";
  if (!isAdmin) {
    return res.status(403).json({
      error: "You are  not authorized to perform this action !",
    });
  }
  Reclamation.findAll()
    .then((reclamations) => {
      res.status(200).json({ reclamations });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};
