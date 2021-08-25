const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

const catchError = (err, statusCode) => {
    if (!err.statusCode) {
        err.statusCode = statusCode;
    }
    next(err);
}
exports.signup = async (req, res, next) => {
    console.log('In signup');
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const err = new Error(errors.array()[0].msg);
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        const email = req.body.email;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword);

        const refreshToken = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'somesupersecretsecretkeyforpropertyRefreshtoken',
            // { expiresIn: '1h' }
        );

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

        const user = new User({ email: email, password: hashedPassword, refreshToken: hashedRefreshToken });
        const result = await user.save();
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'somesupersecretsecretkeyforproperty',
            { expiresIn: '1h' }
        );

        console.log('In signup...SUCCESS');
        res.status(201).json({
            message: 'User created successfully.',
            localId: result._id,
            idToken: token,
            refreshToken: refreshToken,
            expiresIn: 3600 //'1h' => 3600 seconds
        });
    } catch (err) {
        // catchError(err, 500);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.login = async (req, res, next) => {
    console.log('In login');
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const err = new Error(errors.array()[0].msg);
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (!user) {
            const err = new Error('User does not exists with this email.');
            err.statusCode = 401; // Not authenticated
            throw err;
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            const err = new Error('INVALID_PASSWORD');
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'somesupersecretsecretkeyforproperty',
            { expiresIn: '1h' }
        );

        console.log('In login: auth token:');
        console.log(token);

        //save refresh token in DB
        const refreshToken = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString(),
                data: new Date().toISOString()
            },
            'somesupersecretsecretkeyforpropertyRefreshtoken',
        );
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

        user.refreshToken = hashedRefreshToken;
        await user.save();

        res.status(201).json({
            message: 'User created successfully.',
            localId: user._id,
            idToken: token,
            refreshToken: refreshToken,
            expiresIn: 3600
        });
    } catch (err) {
        // catchError(err, 500);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    console.log('In getUser');
    const userId = req.params.userId;
    // console.log(userId)
    try {
        const user = await User.findById(userId).populate('subscriptions');
        if (!user) {
            const err = new Error('USER_NOT_FOUND');
            err.statusCode = 404;
            throw err;
        }
        console.log('getUser()...Successful.');
        // console.log(user);
        const subs = user.subscriptions.map(sub => {
            return { [sub._id]: { hostelId: sub._id } }
        });
        // console.log(subs);
        res.status(200).json({
            // message: 'User Found.',
            [userId]: {
                email: user.email, userId: user._id, subscriptions: subs
            },
        });
    } catch (err) {
        // catchError(err, 500);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.postRefreshToken = async (req, res, next) => {
    console.log('In postRefreshToken');
    try { 
        const refreshToken = req.body.refresh_token;
        const userId = req.body.userId;
        console.log(userId);
        console.log(refreshToken);

        const user = await User.findById(userId);
        // console.log(user.refreshToken);
        const isEqual = await bcrypt.compare(refreshToken, user.refreshToken);
        if(!isEqual) {
            const err = new Error('INVALID_TOKEN');
            err.statusCode = 401;
            throw err;
        }
        console.log('refresh token match.');
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'somesupersecretsecretkeyforproperty',
            { expiresIn: '1h' }
        );
        const newRefreshToken = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString(),
                data: new Date().toISOString()
            },
            'somesupersecretsecretkeyforpropertyRefreshtoken',
        );

        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 12);

        user.refreshToken = hashedRefreshToken;
        await user.save();
        console.log('postRefreshToken: sending response');
        res.status(201).json({
            // message: 'Token generated successfully.',
            localId: user._id,
            idToken: token,
            refreshToken: newRefreshToken,
            expiresIn: 3600
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

