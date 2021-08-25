const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.query.auth;//req.get('Authorization');
    console.log('auth token: ');
    console.log(token);
    if(!token) {
        const err = new Error('Authorization is missing.');
        err.statusCode = 401;
        throw err;
    }
    // const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecretkeyforproperty');
    } catch(err) {
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken) {
        const err = new Error('Not authenticated.');
        err.statusCode = 401;
        throw err;
    }
    req.userId = decodedToken.userId;
    next();
};