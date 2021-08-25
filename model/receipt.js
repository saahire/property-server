const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const receiptSchema = new Schema({
  amount: {
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
  paymentMode: {
    type: Number,
    required: true,
  },
  txDate: {
    type: String,
    required: true,
  },
  paymentFor: {
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
  bedNumber: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model('Receipt', receiptSchema);