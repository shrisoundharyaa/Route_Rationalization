const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: String,
    required: true
  },
  assignedBusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus', // Reference to the Bus model
    default: null
  }
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
