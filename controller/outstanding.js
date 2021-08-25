const { validationResult } = require('express-validator');

const Outstanding = require('../model/outstanding');

exports.addOutstanding = async (req, type, amount) => {
    console.log('In addDepositOutstanding');
    // const today = new Date('01/01/2021');
    // console.log(`Date: ${today}....${today.getMonth()}....${today.getFullYear()}`);
    try {
        // const amount = req.body.deposit;
        const month = req.body.month;
        const year = req.body.year;

        const tenantId = req.body.tenantId;
        const dateTime = req.body.dateTime;

        const bookingId = req.body.bookingId;
        // console.log(`dateTime: ${dateTime}....bookingId: ${bookingId}`);

        const outstanding = new Outstanding({
            amount: amount,
            type: type,
            month: month,
            year: year,
            bookingId: bookingId,
            tenantId: tenantId,
            dateTime: dateTime,
        });

        return await outstanding.save();

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
