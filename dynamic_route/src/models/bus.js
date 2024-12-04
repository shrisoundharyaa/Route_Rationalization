const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  depotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Depot', // Reference to the Depot model
    required: true
  },
  currentDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver', // Reference to the Driver model
    default: null
  },
  driverHistory: [
    {
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver', // Reference to the Driver model
        required: true
      },
      assignedDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        default: null // If null, the driver is currently assigned
      }
    }
  ]
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
