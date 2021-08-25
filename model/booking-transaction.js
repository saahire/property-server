const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingTransactionSchema = new Schema({
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
    bookingState: {
        type: Number,
        required: true,
    },
    txDate: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('BookingTransaction', bookingTransactionSchema);