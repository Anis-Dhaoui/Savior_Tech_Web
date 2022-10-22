const express = require('express');
const db = require('../models');
const roleRouter = express.Router();
roleRouter.use(express.json());
var auth = require('../auth');

// /roles/ api endpoint
roleRouter.route('/')
    .get(auth.verifyToken, (req, res, next) => {
        db.Roles.findAll()
            .then((roles) => {
                if (roles !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(roles);
                } else {
                    err = new Error("Roles collection is empty");
                    next(err);
                }
            },
                err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        db.Roles.create(req.body)
            .then((role) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Role added successfully", role: role });
            })
            .catch(err => next(err));
    })

    //☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠ DANGER ZONE ☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠
    .delete((req, res, next) => {
        db.Roles.destroy({ where: {} })
            .then((role) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "All roles deleted successfully", deletedRole: role });
            },
                err => next(err))
            .catch(err => next(err))
    });
    //☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠ DANGER ZONE ☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠


// /roles/roleId api endpoint
roleRouter.route('/:roleId')
    .get((req, res, next) => {
        db.Roles.findOne({ where: { id: req.params.roleId } })
            .then((role) => {
                if (role != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(role);
                } else {
                    err = new Error("Role not found");
                    next(err);
                }
            },
                err => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        db.Roles.update(req.body, { where: { id: req.params.roleId } })
            .then((role) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Role updated successfully", updatedRole: role });
            },
                err => next(err))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        db.Roles.destroy({ where: { id: req.params.roleId } })
            .then((role) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Role deleted successfully", deletedRole: role });
            },
                err => next(err))
            .catch(err => next(err))
    });

module.exports = roleRouter;