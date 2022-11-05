var express = require('express');
var router = express.Router();
var db = require('../models');

var auth = require('../auth');
const { where } = require('sequelize');
const Reactions = require('../models/Reactions');

router.post('/add', auth.verifyToken, (req, res, next) => {
  db.Reactions.count({ where: { reaction: req.body.reaction, PublicationId: req.body.PublicationId, UserId: req.body.UserId } })
    .then((count) => {
      if (count != 0) {
        db.Reactions.destroy({ where: { reaction: req.body.reaction, PublicationId: req.body.PublicationId, UserId: req.body.UserId } })
          .then(() => {
            res.send("Reaction supprimier")
          })
      } else {
        db.Reactions.create(req.body).then(() => {
          res.send("Reaction ajouter")
        })
      }
    })

})


router.get('/fetchJaime/:id', function (req, res, next) {
  db.Reactions.count({ where: { reaction: "jaime", PublicationId: req.params.id } }).then((count) => {
    res.send("Nbr Jaime  " + count)
  });
});
router.get('/fetchJaimePas/:id', function (req, res, next) {
  db.Reactions.count({ where: { reaction: "jaimePas", PublicationId: req.params.id } }).then((count) => {
    res.send("Nbr Jaime pas " + count)
  })
});

module.exports = router;

