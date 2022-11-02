var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../auth');
const shortUUID = require('short-uuid');
router.post('/add', auth.verifyToken, (req, res) => {
    if (!req.files) {
        db.questions.create({
            description: req.body.description,
            titre: req.body.titre,
            UserId: req.user.id
        }).then(
            (p) => {
                res.send(p);
            }
        );
    } else {

        var file = req.files.image;
        var img_name = `${shortUUID.generate()}-${req.user.id}.${file.mimetype.split('/')[1]}`;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

            file.mv('public/images/upload/' + img_name, function(err) {

                {
                    db.questions.create({
                        description: req.body.description,
                        titre: req.body.titre,
                        image: img_name,
                        UserId: req.user.id
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
router.delete('/remove/:id', auth.verifyToken, (req, res) => {
    db.questions.destroy({ where: { id: req.user.id } }).then(
        () => {
            res.send('removed');
        }
    );
});
router.put('/update/:id', auth.verifyToken, (req, res) => {
    db.questions.update(req.body, { where: { id: req.user.id} }).then(
        () => {
            res.send('updated');
        });

});
router.get('/detail/:id', function(req, res, next) {
    db.questions.findOne({ where: { id: req.params.id } }).then((resp) => {
        res.send(resp);
    });
});

router.get('/search/:search', function (req, res, next) {
    var search = req.params.search;
    db.questions.findAll({
      where: {
        [Op.or]: [{ titre: { [Op.like]: `%${search}%` } }, { description: { [Op.like]: `%${search}%` } }],
      }
    }).then((resp) => {
      res.send(resp);
    });
  });

module.exports = router;