const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const authController = require('../controller/auth');
const User = require('../model/user')

const router = express.Router();

router.post('/signup',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('INVALID_EMAIL') //Please enter valid email.
            .custom(async (value, { req }) => {
                console.log(value);
                const userDoc = await User.findOne({ email: value })
                console.log('userdoc');
                console.log(userDoc);
                if (userDoc) {
                    console.log('user found.');
                    return Promise.reject('E-mail already exists.');
                }
            }).withMessage('EMAIL_EXISTS')
            .normalizeEmail(),
        body('password', 'PASSWORD_LENGTH_5') //Password should be atleast 5 characters long.
            .trim()
            .isLength({ min: 6 }),
        // body('name')
    ],
    authController.signup
);

router.post('/signInWithPassword', authController.login);

router.get('/users/:userId', isAuth, authController.getUser);

router.post('/token', authController.postRefreshToken);


module.exports = router;