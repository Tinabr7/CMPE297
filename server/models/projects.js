const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  address:{
    type: String,
    default: ''

  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  zipcode: {
    type: String,
    default: ''
  },
  long: {
    type: Number,
    default: ''
  },
  lat: {
    type: Number,
    default: ''
  },
  temp: {
    type: Number,
    default: ''
  },
  device_id: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: ''
  },

});

module.exports = mongoose.model('Projects', ProjectSchema);
