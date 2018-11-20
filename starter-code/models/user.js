const mongoose = require('mongoose');

const { Schema }   = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  role: {
    type:  Number,
    enum : [0,1,2],
    default : 2
  },

}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
