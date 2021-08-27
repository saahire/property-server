const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staffSchema = new Schema({
  name: {
      type: String,
      required: true,
  },
  imageUrl: {
      type: String,
    //   required: true,
  },
  email: {
      type: String,
      required: true,
  },
  userKey: {
      type: String,
      required: true,
  },
  isAdmin: {
      type: Boolean,
      required: true,
  },
});

module.exports = mongoose.model('Staff', staffSchema);