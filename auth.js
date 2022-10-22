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
exports.verifyToken = (req, res, next) => {
    let token = req.headers.bearer;
    // console.log(req.headers.bearer);

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};
// *****************************************End verify user *****************************************