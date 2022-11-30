var express = require("express");
var router = express.Router();
var db = require("../models");

var auth = require("../auth");
const { where } = require("sequelize");
const Reactions = require("../models/Reactions");

router.post("/add", (req, res, next) => {
  db.Reactions.count({
    where: {
      PublicationId: req.body.PublicationId,
      UserId: req.body.UserId,
    },
  }).then((count) => {
    if (count != 0) {
      db.Reactions.destroy({
        where: {
          PublicationId: req.body.PublicationId,
          UserId: req.body.UserId,
        },
      }).then(() => {
        db.Reactions.create({
          reaction: req.body.reaction,
          PublicationId: req.body.PublicationId,
          UserId: req.body.UserId,
        });
      });
    } else {
      db.Reactions.create({
        reaction: req.body.reaction,
        PublicationId: req.body.PublicationId,
        UserId: req.body.UserId,
      });
    }
  });
});

router.get("/fetchJaime/:id", function (req, res, next) {
  db.Reactions.count({
    where: { reaction: "jaime", PublicationId: req.params.id },
  }).then((count) => {
    res.json(count);
  });
});
router.get("/fetchJaimePas/:id", function (req, res, next) {
  db.Reactions.count({
    where: { reaction: "jaimePas", PublicationId: req.params.id },
  }).then((count) => {
    res.json(count);
  });
});

module.exports = router;
