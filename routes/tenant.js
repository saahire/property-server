const { body } = require('express-validator');
const express = require('express');
const isAuth = require('../middleware/is-auth');
const tenantController = require('../controller/tenant');

const Tenant = require('../model/tenant');

const router = express.Router();

router.get('/myTenants/:hostelId', isAuth, tenantController.getTenants);

router.get('/tenant/:mobileNumber', isAuth, tenantController.getTenantByMobile);

router.post('/tenant',
    [
        body('name', 'NAME_EMPTY').trim().not().isEmpty(),
        body('email', 'INVALID_EMAIL').trim().isEmail().normalizeEmail(),
        body('priMobile', 'MOBILE_LENGTH_10').trim().isLength({ min: 10, max: 10 })
            .custom(async (value, { req }) => {
                console.log('value: ');
                console.log(value);
                const tenantDoc = await Tenant.findOne({ priMobile: value })
                // console.log('tenantDoc');
                console.log(tenantDoc);
                if (tenantDoc) {
                    console.log('Tenant already exists.');
                    return Promise.reject('Tenant already Exists with mobile.');
                }
            }).withMessage('MOBILE_NUMBER_EXISTS'),
    ],
    isAuth, tenantController.postTenant);

router.patch('/tenant/:tenantId',
    [
        body('name', 'NAME_EMPTY').trim().not().isEmpty(),
        body('email', 'INVALID_EMAIL').trim().isEmail().normalizeEmail(),
    ],
    isAuth, tenantController.patchTenant);

module.exports = router;