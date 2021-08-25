const express = require('express');
const { body } = require('express-validator');

const propertyController = require('../controller/property');
const authController = require('../controller/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// router.get('/hostel/:hostelId', propertyController.getPropertyHostel);

router.post('/hostel',
    // [
    //     body('hostelName', 'EMPTY_PROPERTY_NAME').trim().isEmpty(),
    //     body('ownerName', 'EMPTY_OWNER_NAME').trim().isEmpty(),
    //     body('mobileNumber', 'INVALID_MOBILE_NUMBER').trim().isLength({ min: 10, max: 10 }),
    // ],
    isAuth,
    propertyController.postPropertyHostel
);

router.patch('/hostel/:hostelId',
    // [
    //     body('hostelName', 'EMPTY_PROPERTY_NAME').trim().isEmpty(),
    //     body('ownerName', 'EMPTY_OWNER_NAME').trim().isEmpty(),
    //     body('mobileNumber', 'INVALID_MOBILE_NUMBER').trim().isLength({ min: 10, max: 10 }),
    // ],
    isAuth,
    propertyController.patchPropertyHostel
);

router.get('/hostel/:hostelId', isAuth, propertyController.getPropertyHostel);

router.post('/booking/:hostelId', isAuth, propertyController.postBooking);
router.patch('/booking/:hostelId&:bookingId', isAuth, propertyController.patchBooking);

router.post('/receipt/:hostelId', isAuth, propertyController.postReceipt); 

module.exports = router;