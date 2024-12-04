const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,  // Ensure the registration number is unique
  },
  routeId: {
    type: String,
    required: true,  // Link to the route this bus operates on
  },
  busId: {
    type: String,
    required: true,  // Unique bus ID for identifying buses
    unique: true,
  },
  status: {
    type: String,
    enum: ['running', 'under maintenance', 'in depot'],
    required: true,
    default: 'in depot',  // Default status is 'in depot'
  },
  delayTime: {
    type: Number,
    default: 0,  // Delay time in minutes
  },
  capacity: {
    type: Number,
    required: true,
  },
  depotId: {
    type: String,
    ref: 'Depot',  // Reference to the Depot model
    required: true,
  },
  currentDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',  // Reference to the Driver model
    default: null,
  },
  driverHistory: [
    {
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',  // Reference to the Driver model
        required: true,
      },
      assignedDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        default: null,  // If null, the driver is currently assigned
      },
    },
  ],
});

// Adding geospatial index on location field
busSchema.index({ location: '2dsphere' });

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
