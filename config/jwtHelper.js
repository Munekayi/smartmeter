const jwt = require('jsonwebtoken');
const jwtConfig = require('./config.json').development;
module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers){
        token = req.headers['authorization'].split(' ')[1];
}
    if (!token){
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }else {
        jwt.verify(token, jwtConfig.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
                else {
                    req.email = decoded.email;
                    req.auth = true; // Include the auth: true condition
                    req.token =token;
                    next();
                }
            }
        )
    }
}