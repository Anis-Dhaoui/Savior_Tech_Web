var express = require("express");
var router = express.Router();
var db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const shortUUID = require("short-uuid");

const multer = require("multer");
const Filter = require("bad-words");
const filter = new Filter();
const words = require("../extra-words.json");
const { raw } = require("body-parser");
filter.addWords(...words);

const notifier = require("node-notifier");

var auth = require("../auth");
const { where } = require("sequelize");

router.post("/add",(req, res) => {
  if (!req.files) {
    if (req.body.description !== "") {
      db.Publications.create({
        titre: filter.clean(req.body.titre),
        description: filter.clean(req.body.description),
        statut: "active",
       // UserId: req.user.id,
      }).then((p) => {
        res.send(p);
        notifier.notify("publié");
      });
    } else {
      res.send("Ajouter un sujet ....");
    }
  } else {
    file = req.files.image;
    imgName = `${shortUUID.generate()}.${file.mimetype.split("/")[1]}`;

    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      file.mv("public/images/upload/publications/" + imgName, function (err) {
        {
          if (req.body.description !== "") {
            db.Publications.create({
              titre: filter.clean(req.body.titre),
              description: filter.clean(req.body.description),
              image: imgName,
              statut: "active",
            //  UserId: req.user.id,
            }).then((p) => {
              res.send(p);
              notifier.notify("publié");
            });
          } else {
            res.send("Ajouter un sujet ....");
          }
        }
      });
    }else{
      res.send("type doit etre png , jpg ,gif");
    }
  }
});

router.get("/fetch", function (req, res, next) {
  db.Publications.findAll({
    where: { statut: "active" },
    order: [["createdAt", "desc"]],
  }).then((resp) => {
    res.json(resp);
  });
});

router.delete("/remove/:id", auth.verifyToken, (req, res) => {
  db.Publications.update(
    { statut: "deactive" },
    { where: { id: req.params.id } }
  ).then(() => {
    res.json("supprimer");
  });
});

router.put("/update/:id", auth.verifyToken, (req, res) => {
  db.Publications.update(req.body, { where: { id: req.params.id } }).then(
    () => {
      res.json("updated");
    }
  );
});

router.get("/detail/:id", function (req, res, next) {
  db.Publications.findOne({ where: { id: req.params.id } }).then((resp) => {
    res.json(resp);
  });
});

router.get("/search/:searchTerm", function (req, res, next) {
  var searchTerm = req.params.searchTerm;
  db.Publications.findAll({
    where: {
      statut: "active",
      [Op.or]: [
        { titre: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } },
      ],
    },
  }).then((resp) => {
    res.json(resp);
  });
});

module.exports = router;

//Notification

//uplod image
//bad word

//like dislike
//bloque

//controle de saisie
//recherche multiple
