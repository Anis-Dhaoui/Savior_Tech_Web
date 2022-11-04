var express = require('express');
var router = express.Router();
var db = require('../models');

var auth = require('../auth');

const Filter = require("bad-words");
const filter = new Filter();
const words = require("../extra-words.json");
const { raw } = require('body-parser');
filter.addWords(...words);

router.post('/add', (req, res) => {
  if (req.body.description !=="") {
    db.Commentaires.create({
            description : filter.clean(req.body.description)
    }).then(
      (p) => {
        res.send(p);
      }
    );
  }else{
    res.send("Ajouter un commentaire ....")
  }

});

router.get('/commentairesPublication/:PublicationId', function (req, res, next) {
  var publicationId = req.params.PublicationId;
  db.Commentaires.findAll({ where: { PublicationId: publicationId } }).then((resp) => {
    res.send(resp);
  });
});

router.delete('/remove/:id', auth.verifyToken, (req, res) => {
  db.Commentaires.destroy({ where: { id: req.params.id } }).then(
    () => {
      res.send('removed');
    }
  );
});





module.exports = router;