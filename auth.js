const db = require('./models');

var jwt = require('jsonwebtoken');
const secretKey = "123-456-789-101-112";

// ***************************************** Start Generate JWT Token *****************************************
exports.getToken = (user) => {
    return (
        jwt.sign(user, secretKey, { expiresIn: 86400 }) // token will expired in 24 hours
    )
};
// ***************************************** End Generate JWT Token *****************************************


// ***************************************** Start verify if user authenticated *****************************************
exports.verifyToken = async (req, res, next) => {
    let token = req.headers.bearer;
    // console.log(req.headers.bearer);

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        req.user = await db.Users.findOne({
            where: { id: decoded.id },
            raw: true,
            include: { model: db.Roles },
            attributes: { exclude: ['password'] }
        });

        next();
    });
};
// ***************************************** End verify user *****************************************


// ***************************************** Start verify ADMIN *****************************************
exports.verifyAdmin = (req, err, next) => {

    if (req.user.admin) {
        next();
    } else {
        var err = new Error("You're not admin, you're not allowed to perform this operation.");
        err.status = 403;
        next(err);
    }
};
// ***************************************** End verify ADMIN *****************************************