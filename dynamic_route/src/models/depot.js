const mongoose = require('mongoose');
 
const depotSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  
});

const Depot = mongoose.model('Depot', depotSchema);

module.exports = Depot;


// buses: [
//   {
//     id: { type: Number, required: true },
//     status: { type: String, enum: ['Available', 'Departed', 'Under Maintenance'], required: true },
//   },
// ],
// location:{
//   type:String,
//   required:true
// },
// buses: [
//   {
//     type:mongoose.Schema.Types.ObjectId,
//     ref:'Bus'
//   },
// ],