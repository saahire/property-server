const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    rent: {
        type: Number,
        required: true,
    },
    deposit: {
        type: Number,
        required: true,
    },
    bookingDate: {
        type: String,
        required: true,
    },
    lastOutstandingGenerated: {
        type: String,
        // required: true,
    },
    whenToGenerateOutstanding: {
        type: String,
        required: true,
    },
    closeDate: {
        type: String,
        // required: true,
    },
    bookingNote: {
        type: String,
        // required: true,
    },
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    bedNumber: {
        type: String,
        required: true,
    },
    roomNumber: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Booking', bookingSchema);