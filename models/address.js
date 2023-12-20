const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isSelect:{
    type:Boolean,
    default:false
  }
  
});

const Addressmodel = mongoose.model('Address', addressSchema);

module.exports = Addressmodel;
