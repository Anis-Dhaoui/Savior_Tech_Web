var express = require('express');
var router = express.Router();
var db = require('../models');

router.post('/add', (req, res) => {
    if (!req.files) {
        db.questions.create({
            description: req.body.description,
            date: req.body.date,
            titre: req.body.titre,
            UserId: req.body.UserId
        }).then(
            (p) => {
                res.send(p);
            }
        );
    } else {

        var file = req.files.image;
        var img_name = file.name;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

            file.mv('public/images/upload/' + img_name, function(err) {

                {
                    db.questions.create({
                        description: req.body.description,
                        date: req.body.date,
                        titre: req.body.titre,
                        image: img_name,
                        UserId: req.body.UserId
                    }).then(
                        (p) => {
                            res.send(p);
                        }
                    );
                }
            });
        }

    }
});

router.get('/', function(req, res, next) {
    db.questions.findAll().then((resp) => {
        res.send(resp);
    });
});
router.delete('/remove/:id', (req, res) => {
    db.questions.destroy({ where: { id: req.params.id } }).then(
        () => {
            res.send('removed');
        }
    );
});
router.put('/update/:id', (req, res) => {
    db.questions.update(req.body, { where: { id: req.params.id } }).then(
        () => {
            res.send('updated');
        });

});
router.get('/detail/:id', function(req, res, next) {
    db.questions.findOne({ where: { id: req.params.id } }).then((resp) => {
        res.send(resp);
    });
});



module.exports = router;