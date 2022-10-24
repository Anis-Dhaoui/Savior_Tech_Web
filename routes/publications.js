var express = require('express');
var router = express.Router();
var db = require('../models');


router.post('/add', (req, res) => {
    db.Publications.create(req.body).then(
        (p) => {
            res.send(p);
        }
    );
});


router.get('/fetch', function (req, res, next) {
    db.Publications.findAll().then((resp) => {
      res.send(resp);
    });
  });
  router.delete('/remove/:id', (req, res) => {
    db.Publications.destroy({ where: { id: req.params.id } }).then(
      () => {
        res.send('removed');
      }
    );
  });
  router.put('/update/:id', (req, res) => {
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



  
  
  
module.exports = router;