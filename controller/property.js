const { validationResult } = require('express-validator');

const User = require('../model/user');
const Hostel = require('../model/hostel');
const Booking = require('../model/booking');
const BookingTransaction = require('../model/booking-transaction');
const Receipt = require('../model/receipt');
const Outstanding = require('../model/outstanding');

const outstandingController = require('./outstanding');


// enum PaymentFor {
//     Rent,
//     Deposit,
//     Penalty,
//   };

const RENT = 0;
const DEPOSIT = 1;

const addBookingTransaction = async (bookingId, tenantId, bookingState, txDate, email) => {
    console.log('In addBookingTransaction()...Adding Booking Transaction.');
    //check if params are not null
    const bookingTx = new BookingTransaction({
        bookingId: bookingId,
        tenantId: tenantId,
        bookingState: bookingState,
        txDate: txDate,
        email: email,
    });
    return await bookingTx.save();
};

exports.postPropertyHostel = async (req, res, next) => {
    console.log('In postPropertyHostel');
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const err = new Error(errors.array()[0].msg);
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        const userId = req.body.userId;
        const hostelName = req.body.hostelName;
        const ownerName = req.body.ownerName;
        const mobileNumber = req.body.mobileNumber;
        const email = req.body.email;
        const address = req.body.address;
        const propertyImageUrl = req.body.propertyImageUrl;
        const hostelFloors = req.body.hostelFloors;

        console.log(hostelName);
        console.log(hostelFloors);
        hostelFloors.map(floor => {
            floor['rooms'].map(room => {
                console.log(room);
            });
        });
        //check Auth & user Ids
        const hostel = new Hostel({
            userId: userId,
            hostelName: hostelName,
            ownerName: ownerName,
            mobileNumber: mobileNumber,
            email: email,
            address: address,
            propertyImageUrl: propertyImageUrl,
            hostelFloors: hostelFloors
        });
        console.log(hostel._id);
        console.log(hostel);
        hostel.hostelFloors.map(floor => {
            floor['rooms'].map(room => {
                console.log(room);
            });
        });
        const result = await hostel.save();
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error('INVALID_USERID');
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        user.subscriptions.push(result);
        await user.save();
        res.status(200).json({
            [result._id]: hostel,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.patchPropertyHostel = async (req, res, next) => {
    console.log('In patchPropertyHostel');
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const err = new Error(errors.array()[0].msg);
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        const hostelId = req.params.hostelId;
        // const userId = req.body.userId;
        const hostelName = req.body.hostelName;
        const ownerName = req.body.ownerName;
        const mobileNumber = req.body.mobileNumber;
        const email = req.body.email;
        const address = req.body.address;
        const propertyImageUrl = req.body.propertyImageUrl;
        const hostelFloors = req.body.hostelFloors;

        console.log(hostelName);
        console.log(hostelId);
        // console.log(hostelFloors);
        // hostelFloors.map(floor => {
        //     floor['rooms'].map(room => {
        //         console.log(room);
        //     });
        // });
        //check Auth & user Ids
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 404;
            throw err;
        }
        // console.log('hoste Data:');
        // console.log(hostel);

        // hostel.userId = userId; //should not be changed
        hostel.hostelName = hostelName;
        hostel.ownerName = ownerName;
        hostel.mobileNumber = mobileNumber;
        hostel.email = email;
        hostel.address = address;
        hostel.propertyImageUrl = propertyImageUrl;
        hostel.hostelFloors = hostelFloors;

        // console.log(hostel._id);
        // console.log(hostel);
        // hostel.hostelFloors.map(floor => {
        //     floor['rooms'].map(room => {
        //         console.log(room);
        //     });
        // });
        const result = await hostel.save();

        res.status(200).json({
            [result._id]: hostel,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getPropertyHostel = async (req, res, next) => {
    console.log('In getPropertyHostel');
    const hostelId = req.params.hostelId;
    try {
        const hostel = await Hostel.findById(hostelId)
            .populate('myTenants.tenantId')
            .populate('bookings.bookingId')
            .populate('bookingTransaction.bookingTransactionId')
            .populate('outstandings.outstandingId')
            .populate('receipts.receiptId');
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 404;
            throw err;
        }
        let myTenants = {};
        hostel.myTenants.forEach(myTenant => {
            myTenants[[myTenant.tenantId._id]] = {
                name: myTenant.tenantId.name,
                imageUrl: myTenant.tenantId.imageUrl,
                priMobile: myTenant.tenantId.priMobile,
                email: myTenant.tenantId.email,
                secMobile: myTenant.tenantId.secMobile,
                address: myTenant.tenantId.address,
                hostelId: myTenant.tenantId.hostelId,
            };
        });
        console.log('myBooking');
        let myBookings = {};
        hostel.bookings.forEach(myBooking => {
            myBookings[[myBooking.bookingId._id]] = {
                rent: myBooking.bookingId.rent,
                deposit: myBooking.bookingId.deposit,
                bookingDate: myBooking.bookingId.bookingDate,
                lastOutstandingGenerated: myBooking.bookingId.lastOutstandingGenerated,
                whenToGenerateOutstanding: myBooking.bookingId.whenToGenerateOutstanding,
                closeDate: myBooking.bookingId.closeDate,
                bookingNote: myBooking.bookingId.bookingNote,
                tenantId: myBooking.bookingId.tenantId,
                bedNumber: myBooking.bookingId.bedNumber,
                roomNumber: myBooking.bookingId.roomNumber,
            };
        });
        console.log(`myBooking Txs: length: ${hostel.bookingTransaction.length}`);
        let myBookingsTxs = {};
        hostel.bookingTransaction.forEach(myBookingTx => {
            myBookingsTxs[[myBookingTx.bookingTransactionId._id]] = {
                bookingId: myBookingTx.bookingTransactionId.bookingId,
                tenantId: myBookingTx.bookingTransactionId.tenantId,
                bookingState: myBookingTx.bookingTransactionId.bookingState,
                txDate: myBookingTx.bookingTransactionId.txDate,
                email: myBookingTx.bookingTransactionId.email
            };
        });

        console.log('myOutstandings');
        let myOutstandings = {};
        hostel.outstandings.forEach(myOutstanding => {
            myOutstandings[[myOutstanding.outstandingId._id]] = {
                amount: myOutstanding.outstandingId.amount,
                type: myOutstanding.outstandingId.type,
                month: myOutstanding.outstandingId.month,
                year: myOutstanding.outstandingId.year,
                bookingId: myOutstanding.outstandingId.bookingId,
                tenantId: myOutstanding.outstandingId.tenantId,
                dateTime: myOutstanding.outstandingId.dateTime
            };
        });
        console.log('myReceipts');
        let myReceipts = {};
        hostel.receipts.forEach(myReceipt => {
            myReceipts[[myReceipt.receiptId._id]] = {
                amount: myReceipt.receiptId.amount,
                month: myReceipt.receiptId.month,
                year: myReceipt.receiptId.year,
                paymentMode: myReceipt.receiptId.paymentMode,
                txDate: myReceipt.receiptId.txDate,
                paymentFor: myReceipt.receiptId.paymentFor,
                bookingId: myReceipt.receiptId.bookingId,
                tenantId: myReceipt.receiptId.tenantId,
                bedNumber: myReceipt.receiptId.bedNumber,
                discount: myReceipt.receiptId.discount,
                note: myReceipt.receiptId.note,
            };
        });
        console.log(`Setting: ${hostel.settings}`);
        res.status(200).json({
            userId: hostel.userId,
            hostelName: hostel.hostelName,
            ownerName: hostel.ownerName,
            mobileNumber: hostel.mobileNumber,
            address: hostel.address,
            propertyImageUrl: hostel.propertyImageUrl,
            hostelFloors: hostel.hostelFloors,
            myTenants: myTenants,
            bookings: myBookings,
            bookingTransaction: myBookingsTxs,
            outstandings: myOutstandings,
            receipts: myReceipts,
            settings: hostel.settings,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.postBooking = async (req, res, next) => {
    console.log('In postBooking');
    try {
        const hostelId = req.params.hostelId;
        console.log(`hostelId: ${hostelId}`);

        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 404;
            throw err;
        }

        const rent = req.body.rent;
        const deposit = req.body.deposit;
        const bookingDate = req.body.bookingDate;
        const lastOutstandingGenerated = null;
        const whenToGenerateOutstanding = req.body.whenToGenerateOutstanding;
        const closeDate = req.body.closeDate;
        const bookingNote = req.body.bookingNote;
        const roomNumber = req.body.roomNumber;
        const tenantId = req.body.tenantId;
        const bedNumber = req.body.bedNumber;
        console.log(`rent: ${rent}`);
        // if(anything is null) {
        //     const err = new Error('INVALID_PARAMS');
        //     err.statusCode = 404;
        //     throw err;
        // }

        const newBooking = new Booking({
            rent: rent,
            deposit: deposit,
            bookingDate: bookingDate,
            lastOutstandingGenerated: lastOutstandingGenerated,
            whenToGenerateOutstanding: whenToGenerateOutstanding,
            closeDate: closeDate,
            bookingNote: bookingNote,
            roomNumber: roomNumber,
            tenantId: tenantId,
            bedNumber: bedNumber,
        });
        await newBooking.save();

        //Booking Transaction History
        const bTx = await addBookingTransaction(newBooking._id, tenantId, req.body.bookingState, req.body.txDate, req.body.email);
        hostel.bookingTransaction.push({ bookingTransactionId: bTx._id });

        //addOutstanding => deposit
        req.body.bookingId = newBooking._id.toString();
        let depositOutstanding;
        if (deposit > 0) {
            depositOutstanding = await outstandingController.addOutstanding(req, DEPOSIT, deposit);
            hostel.outstandings.push({ outstandingId: depositOutstanding._id });
            // console.log(`outstanding: ${outstanding}`);
        }

        const isRentOutstanding = req.body.isRentOutstanding;
        let rentOutstanding;
        if (isRentOutstanding) {
            if (rent > 0) {
                rentOutstanding = await outstandingController.addOutstanding(req, RENT, rent);
                hostel.outstandings.push({ outstandingId: rentOutstanding._id });
            }
            //Update Next Booking Date => whenToGenerateOutstanding
            const whenToGenerateOutstandingDate = req.body.whenToGenerateOutstandingDate;
            newBooking.lastOutstandingGenerated = req.body.lastOutstandingGenerated;
            newBooking.whenToGenerateOutstanding = whenToGenerateOutstandingDate;
            await newBooking.save();
        }
        hostel.bookings.push({ bookingId: newBooking._id });
        await hostel.save();


        res.status(200).json({
            name: newBooking._id,
            bookingTransactions: bTx,
            rentOutstanding: rentOutstanding,
            depositOutstanding: depositOutstanding,
            message: 'Booking added successfully.'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.patchBooking = async (req, res, next) => {
    console.log('In patchBooking');
    try {
        const hostelId = req.params.hostelId;
        const bookingId = req.params.bookingId;

        console.log(`hostelId: ${hostelId} ... BookingId: ${bookingId}`);
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 404;
            throw err;
        }
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            const err = new Error('INVALID_BOOKING_ID');
            err.statusCode = 404;
            throw err;
        }
        const closeDate = req.body.closeDate;
        booking.closeDate = closeDate;
        await booking.save();

        const bTx = await addBookingTransaction(booking._id,
            booking.tenantId,
            1, //req.body.bookingState => BookingState.Closed,
            req.body.txDate,
            req.body.email
        );
        hostel.bookingTransaction.push({ bookingTransactionId: bTx._id });
        await hostel.save();

        res.status(200).json({
            bookingTransactions: bTx, //{ ...bTx._doc, txDate: bTx.txDate.toISOString() },
            message: 'Booking closed successfully',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.postReceipt = async (req, res, next) => {
    console.log('In postReceipt.');
    try {
        const hostelId = req.params.hostelId;
        // console.log(hostelId);
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 404;
            throw err;
        }
        await handleRentReceipt(req, hostel);
        await handleDepositReceipt(req, hostel);

        res.status(404).json({
            message: 'Test',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

const handleRentReceipt = async (req, hostel) => {
    console.log('In handleRentReceipt');
    const rentOutstaningId = req.body.rentOutstaningId;
    if (rentOutstaningId === null) {
        console.log('rentOutstaningId is null.');
        return;
    }
    const rentAmount = req.body.rentAmount || 0;
    // const rentMonth = req.body.rentMonth;
    // const rentYear = req.body.rentYear;
    const rentPaymentMode = req.body.rentPaymentMode;
    const rentTxDate = req.body.rentTxDate;
    // const rentPaymentFor = req.body.rentPaymentFor;
    // const rentBookingId = req.body.rentBookingId;
    // const rentTenantId = req.body.rentTenantId;
    const rentBedNumber = req.body.rentBedNumber;
    const rentDiscount = req.body.rentDiscount || 0;
    const rentNote = req.body.rentNote;

    const outstanding = await Outstanding.findById(rentOutstaningId);
    if (outstanding) {
        if (rentAmount !== 0 || rentDiscount !== 0) {
            const rentReceipt = new Receipt({
                amount: rentAmount,
                month: outstanding.month,
                year: outstanding.year,
                paymentMode: rentPaymentMode,
                txDate: rentTxDate,
                paymentFor: outstanding.type,
                bookingId: outstanding.bookingId,
                tenantId: outstanding.tenantId,
                bedNumber: rentBedNumber,
                discount: rentDiscount,
                note: rentNote,
            });
            await rentReceipt.save();
            hostel.receipts.push({ receiptId: rentReceipt._id });
            await hostel.save();
            console.log(`rentReceipt: ${rentReceipt}`);

            const totalRentAmount = +rentAmount + +rentDiscount;
            if (totalRentAmount !== 0) {
                if (totalRentAmount < outstanding.amount) { //PARTIAL Payment
                    outstandingAmount = outstanding.amount - rentAmount;
                    //Update outstanding record
                    outstanding.amount = outstandingAmount;
                    await outstanding.save();
                    console.log('Partial rent outstanding modified');

                } else { //Full Payment
                    // Remove outstanding record
                    await Outstanding.findByIdAndDelete(outstanding._id);
                    hostel.pull(outstanding._id);
                    console.log('Full rent outstanding removed.');
                }
            }
        }
    }
};

const handleDepositReceipt = async (req, hostel) => {
    console.log('In handleDepositReceipt');
    const depositOutstaningId = req.body.depositOutstaningId;
    if (depositOutstaningId === null) {
        console.log('depositOustandingId is null.');
        return;
    }
    const depositAmount = req.body.depositAmount || 0;
    // const depositMonth = req.body.depositMonth;
    // const depositYear = req.body.depositYear;
    const depositPaymentMode = req.body.depositPaymentMode;
    const depositTxDate = req.body.depositTxDate;
    // const depositPaymentFor = req.body.depositPaymentFor;
    // const depositBookingId = req.body.depositBookingId;
    // const depositTenantId = req.body.depositTenantId;
    const depositBedNumber = req.body.depositBedNumber;
    const depositDiscount = req.body.depositDiscount || 0;
    const depositNote = req.body.depositNote;

    console.log(depositBedNumber);
    const outstanding = await Outstanding.findById(depositOutstaningId);
    if (outstanding) {
        if (depositAmount !== 0 || depositDiscount !== 0) {
            const depositReceipt = new Receipt({
                amount: depositAmount,
                month: outstanding.month,
                year: outstanding.year,
                paymentMode: depositPaymentMode,
                txDate: depositTxDate,
                paymentFor: outstanding.type,
                bookingId: outstanding.bookingId,
                tenantId: outstanding.tenantId,
                bedNumber: depositBedNumber,
                discount: depositDiscount,
                note: depositNote,
            });
            await depositReceipt.save();
            console.log('531');
            hostel.receipts.push({ receiptId: depositReceipt._id });
            console.log('533');
            await hostel.save();
            console.log('535');
            console.log(`depositReceipt: ${depositReceipt}`);

            const totalRentAmount = +depositAmount + +depositDiscount;
            if (totalRentAmount !== 0) {
                if (totalRentAmount < outstanding.amount) { //PARTIAL Payment
                    outstandingAmount = outstanding.amount - depositAmount;
                    //Update outstanding record
                    outstanding.amount = outstandingAmount;
                    await outstanding.save();
                    console.log('Partial deposit outstanding modified.');

                } else { //Full Payment
                    // Remove outstanding record
                    await Outstanding.findByIdAndDelete(outstanding._id);
                    hostel.pull(outstanding._id);
                    console.log('Full deposit outstanding removed.');
                }
            }
        }
    }
};