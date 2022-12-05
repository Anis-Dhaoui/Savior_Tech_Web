var express = require("express");
var router = express.Router();
var db = require("../models");

var auth = require("../auth");

const Filter = require("bad-words");
const filter = new Filter();
const words = require("../extra-words.json");
const { raw } = require("body-parser");
filter.addWords(...words);

const notifier = require("node-notifier");

router.post("/add", auth.verifyToken, (req, res) => {
  if (req.body.description !== "") {
    db.Commentaires.create({
      description: filter.clean(req.body.description),
      UserId: req.user.id,
      statut: "active",
      PublicationId: req.body.PublicationId,
    }).then((p) => {
      res.send(p);
      notifier.notify("commentaire ajouté");
    });
  } else {
    res.send("Ajouter un commentaire ....");
  }
});

router.get(
  "/commentairesPublication/:PublicationId",
  function (req, res, next) {
    var publicationId = req.params.PublicationId;
    db.sequelize
      .query(
        `SELECT fullName , description , commentaires.id,commentaires.UserId,avatar,
        commentaires.createdAt FROM commentaires,
         users WHERE commentaires.UserId = users.id and commentaires.PublicationId = "${publicationId}" and commentaires.statut = "active"`
      )
      .then((resp) => {
        res.json(resp);
      });
  }
);

router.delete("/remove/:id", auth.verifyToken, (req, res) => {
  db.Commentaires.update(
    { statut: "deactive" },
    { where: { id: req.params.id } }
  ).then(() => {
    res.send("removed");
  });
});
var a = "hello marwen";
var x = `${a} = 55`;

module.exports = router;
