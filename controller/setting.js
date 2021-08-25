const Hostel = require('../model/hostel');

exports.getSetting = async (req, res, next) => {
    const hostelId = req.params.hostelId;
    try {
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 404;
            throw err;
        }

        console.log(`send SMS: ${hostel.settings}`);
        res.status(200).json({ settings: hostel.settings });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.patchSetting = async (req, res, next) => {
    const hostelId = req.params.hostelId;
    try {
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 404;
            throw err;
        }
        const sendSms = req.body.sendSms;
        hostel.settings = { sendSms: sendSms };
        console.log(`send SMS: ${hostel.settings}`);
        await hostel.save();
        res.status(200).json({ settings: hostel.settings });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};