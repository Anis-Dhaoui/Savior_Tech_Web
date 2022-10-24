var express = require('express');
var router = express.Router();
var db = require('../models');

var auth = require('../auth');
const { where } = require('sequelize');
const Reactions = require('../models/Reactions');

router.post('/add', async (req, res, next) => {
  db.Reactions.findAndCountAll({ where: { reaction: req.body.reaction, PublicationId: req.body.PublicationId, UserId: req.body.UserId } })
    .then(count => {
      if (count != 0) {
        db.Reactions.destroy({ where: { reaction: req.body.reaction, PublicationId: req.body.PublicationId, UserId: req.body.UserId } })
        res.send("Reaction supprimier");
      }
      db.Reactions.create(req.body).then(
        (p) => {
          res.send(p);
        }
      );

    });

});


router.get('/fetchJaime', function (req, res, next) {
  db.Reactions.findAndCountAll({ where: { reaction: "jaime" } }).then((resp) => {
    res.send(resp);
  });
});
router.get('/fetchJaimePas', function (req, res, next) {
  db.Reactions.findAndCountAll({ where: { reaction: "jaimePas" } }).then((resp) => {
    res.send(resp);
  });
});

module.exports = router;

