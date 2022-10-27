var express = require('express');
var router = express.Router();
var db = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

var auth = require('../auth');
const { where } = require('sequelize');


router.post('/add', auth.verifyToken, (req, res) => {

  db.Publications.create(req.body).then(
    (p) => {
      res.send(p);
    }
  );
});


router.get('/fetch', function (req, res, next) {

  db.Publications.findAll({ where: { statut:'active' }}).then((resp) => {

    res.send(resp);


  });
});
router.delete('/remove/:id', auth.verifyToken, (req, res) => {
  db.Publications.destroy({ where: { id: req.params.id } }).then(
    () => {
      res.send('removed');
    }
  );
});
router.put('/update/:id', auth.verifyToken, (req, res) => {
  db.Publications.update(req.body, { where: { id: req.params.id } }).then(
    () => {
      res.send('updated');
    });

});
router.get('/detail/:id', function (req, res, next) {
  db.Publications.findOne({ where: { id: req.params.id } }).then((resp) => {
    res.send(resp);
  });
});

router.get('/search/:searchTerm', function (req, res, next) {
  var searchTerm = req.params.searchTerm;
  db.Publications.findAll({
    where: {
      [Op.or]: [{ titre: { [Op.like]: `%${searchTerm}%` } }, { description: { [Op.like]: `%${searchTerm}%` } }],
    }
  }).then((resp) => {
    res.send(resp);
  });
});

router.post('/signaler/:id', (req, res) => {
  var idUser = req.params.id;
  db.Publications.findOne({ where: { id } })
})

module.exports = router;


// Signaler un commentaire, un user
// Notification
// Une liste des favoris     

