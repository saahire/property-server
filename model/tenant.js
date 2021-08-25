const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tenantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    priMobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    secMobile: {
        type: String,
    },
    address: {
        type: String,
    },
    hostelId: {
        type: Schema.Types.ObjectId,
        ref: 'Hostel',
        required: true,
    }
});

module.exports = mongoose.model('Tenant', tenantSchema);