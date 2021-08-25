const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hostelSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hostelName: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        // required: true,
    },
    propertyImageUrl: {
        type: String,
        // required: true,
    },
    hostelFloors: [{
        floor: { type: String, required: true, },
        rooms: [{ type: Object }]
    }],
    myTenants: [{
        priMobile: { type: String, required: true },
        tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true }
    }],
    bookings: [{
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        }
    }],
    bookingTransaction: [{
        bookingTransactionId: {
            type: Schema.Types.ObjectId,
            ref: 'BookingTransaction',
            required: true,
        }
    }],
    outstandings: [{
        outstandingId: {
            type: Schema.Types.ObjectId,
            ref: 'Outstanding',
            required: true,
        }
    }],
    receipts: [{
        receiptId: {
            type: Schema.Types.ObjectId,
            ref: 'Receipt',
            required: true,
        }
    }],
    settings: {
        sendSms: {
            type: Boolean,
            default: false,
        }
    }

});

module.exports = mongoose.model('Hostel', hostelSchema);