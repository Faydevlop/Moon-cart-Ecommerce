const mongoose = require('mongoose');
const Address = require('./address');
const bcrypt = require('bcrypt');



const userSchema = mongoose.Schema({

  Username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isBlocked:{type:Boolean,default:false},
  pImage: {
    type: String,
  },
  Mobile:{ type: String, required: true },
  address :[{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  referralCode: String,
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  Wallet:{type:Number},
});




const User = mongoose.model('users', userSchema); // Use 'admins' as the collection name


module.exports = User;
