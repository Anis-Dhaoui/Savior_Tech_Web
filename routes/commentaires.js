var express = require('express');
var router = express.Router();
var db = require('../models');


router.post('/add', (req, res) => {
    db.Commentaires.create(req.body).then(
        (p) => {
            res.send(p);
        }
    );
});


router.get('/fetch', function (req, res, next) {
    db.Commentaires.findAll().then((resp) => {
      res.send(resp);
    });
  });
  router.delete('/remove/:id', (req, res) => {
    db.Commentaires.destroy({ where: { id: req.params.id } }).then(
      () => {
        res.send('removed');
      }
    );
  });
  
 
  
  
  
module.exports = router;