var express = require('express');
var router = express.Router();
var db = require('../models');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const shortUUID = require('short-uuid');

const multer = require('multer');
const Filter = require("bad-words");
const filter = new Filter();
const words = require("../extra-words.json");
const { raw } = require('body-parser');
filter.addWords(...words);

const notifier = require('node-notifier')



var auth = require('../auth');
const { where } = require('sequelize');

router.post('/add', auth.verifyToken, (req, res) => {

  if (!req.files) {
    if (req.body.description !== "") {
      db.Publications.create({
        titre: filter.clean(req.body.titre),
        description: filter.clean(req.body.description),

        statut: 'active',
        UserId: req.user.id
      }).then(
        (p) => {
          res.send(p);
          notifier.notify('publié');
        }
      );
    } else {
      res.send("Ajouter un sujet ....")
    }
  } else {

    var file = req.files.image;
    var imgName = `${shortUUID.generate()}.${file.mimetype.split('/')[1]}`;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

      file.mv('public/images/upload/publications/' + imgName, function (err) {

        {
          if (req.body.description !== "") {
            db.Publications.create({
              titre: filter.clean(req.body.titre),
              description: filter.clean(req.body.description),
              image: imgName,
              statut: 'active',
              UserId: req.user.id
            }).then(
              (p) => {
                res.send(p);
                notifier.notify('publié');

              }
            );
          } else {
            res.send("Ajouter un sujet ....")
          }
        }
      });
    }

  }
});


router.get('/fetch', function (req, res, next) {


  db.Publications.findAll({ where: { statut: 'active' }, order: [['createdAt', 'desc']] }).then((resp) => {

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
      statut: 'active',
      [Op.or]: [{ titre: { [Op.like]: `%${searchTerm}%` } }, { description: { [Op.like]: `%${searchTerm}%` } }]
    }
  }).then((resp) => {
    res.send(resp)
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




