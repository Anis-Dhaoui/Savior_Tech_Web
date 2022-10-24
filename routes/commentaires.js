var express = require('express');
var router = express.Router();
var db = require('../models');

var auth = require('../auth');

router.post('/add', auth.verifyToken , (req, res) => {
  db.Commentaires.create(req.body).then(
    (p) => {
      res.send(p);
    }
  );
});

router.get('/commentairesPublication/:PublicationId', function (req, res, next) {
  var publicationId = req.params.PublicationId;
  db.Commentaires.findAll({ where: { PublicationId: publicationId } }).then((resp) => {
    res.send(resp);
  });
});

router.delete('/remove/:id', auth.verifyToken , (req, res) => {
  db.Commentaires.destroy({ where: { id: req.params.id } }).then(
    () => {
      res.send('removed');
    }
  );
});





module.exports = router;