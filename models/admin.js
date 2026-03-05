const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});





const Admin = mongoose.model('Admin', adminSchema); // Use 'admins' as the collection name


module.exports = Admin;
