const mongoose = require("mongoose");

const trafficIncidentSchema = new mongoose.Schema({
  type: String, 
  description: String, 
  timestamp: Date, 
  location: String, 
});

const TrafficIncident = mongoose.model("TrafficIncident", trafficIncidentSchema);

module.exports= TrafficIncident;