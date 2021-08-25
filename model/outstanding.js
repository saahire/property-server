const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// // 'amount': outstanding.amount,
// 'type': PaymentFor.Deposit.index,
// 'month': today.month,
// 'year': today.year,
// // 'bookingId': outstanding.bookingId,
// // 'tenantId': outstanding.tenantId,
// 'dateTime': today.toIso8601String(),
const outstandingSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    dateTime: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Outstanding', outstandingSchema);