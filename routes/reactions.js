var express = require('express');
var router = express.Router();
var db = require('../models');


router.post('/add', (req, res) => {
    db.reactions.create(req.body).then(
        (p) => {
            res.send(p);
        }
    );
});


router.get('/fetch', function (req, res, next) {
    db.reactions.findAll().then((resp) => {
        res.send(resp);
    });
});
router.delete('/remove/:id', (req, res) => {
    db.reactions.destroy({ where: { id: req.params.id } }).then(
        () => {
            res.send('removed');
        }
    );
});
module.exports = router;

