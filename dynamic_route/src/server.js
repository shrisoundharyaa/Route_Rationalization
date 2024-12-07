  const express = require('express'); 
  const mongoose = require('mongoose');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const Depot = require('./models/depot.js')
  const Bus=require('./models/bus')
  const TrafficIncident = require('./models/traffic.js')
  const Driver = require('./models/driver.js')

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.get('/depots', async (req, res) => {
      try {
        const depots = await Depot.find();
        res.json(depots);
      } catch (err) {
          console.error('Error fetching depots:', err.message);
        res.status(500).send(err.message);
      }
    });
    
    app.post('/depots', async (req, res) => {
      const {id, name, capacity } = req.body;
    
  
      const newDepot = new Depot({
        id:Math.floor(Math.random() * 1000),
        name,
        capacity,
      });
    
      try {
        await newDepot.save();
        res.status(201).json(newDepot);
      } catch (error) {
        if (error.code === 11000) {
          res.status(400).json({ message: 'Depot ID already exists' });
        } else {
          console.error(error);
          res.status(500).json({ message: 'Error adding depot' });
        }
      }
    });
  app.get('/depots/:id',async(req,res)=>{
      try{
          const depotId = parseInt(req.params.id);
          const depot = await Depot.findOne({ id: depotId });
          if(!depot){
              return res.status(404).send('Depot not found');
          }
          res.json(depot);
      }
      catch(err){
          console.error('Error fetching depot by ID:', err);
          res.status(500).send(err.message);
      }
  });
  app.post('/buses', async (req, res) => {
    try {
      const { registrationNumber, routeId,busId, status, delayTime, capacity, depotId } = req.body;
  
      // Fetch the depot by its name or other unique identifier
      
      const bus = new Bus({
        registrationNumber,
        routeId,
        busId,
        status,
        delayTime,
        capacity,
        depotId, // Use the depot's MongoDB _id as depotId
      });
  
      // Save the bus to the database
      await bus.save();
      res.status(201).json(bus);
    } catch (error) {
      console.error('Error adding bus:', error);
      res.status(500).json({ message: 'Failed to add bus', error });
    }
  });
  app.get('/buses', async (req, res) => {
    const { depotId } = req.query;
    try {
      const query = depotId ? { depotId } : {};
      const buses = await Bus.find(query); 
      if (!buses || buses.length === 0) {
        return res.status(404).json({ error: 'No buses found' });
      }
      res.status(200).json(buses);
    } catch (error) {
      console.error('Error fetching buses:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  app.get('/api/getAllBuses', async (req, res) => {
    try {
     const buses =await Bus.find().populate('currentDriverId', 'name');
     res.status(200).json(buses);
    } catch (error) {
      console.error('Error fetching bus details:', error);
      res.status(500).json({ error: 'An error occurred while fetching bus details.' });
    }
  });
  
  app.get("/incidents", async (req, res) => {
    try {
      const incidents = await TrafficIncident.find();
      
      res.json(incidents);
    } catch (err) {
      res.status(500).send("Error fetching incidents");
    }
  });

  app.get('/api/getAllDrivers', async (req, res) => {
    try {
      
      const drivers = await Driver.find().populate('assignedBusId'); // This should return all drivers
      if (!drivers || drivers.length === 0) {
        console.log("No drivers found");
        return res.status(404).json({ error: 'No drivers found' });
      }
  
      res.json(drivers); // Return the list of drivers
    } catch (error) {
      console.error('Error fetching drivers:', error);
      res.status(500).json({ error: 'Unable to fetch drivers' });
    }
  });
  app.put('/api/editBus', async (req, res) => {
    const { busId, routeId, driverId } = req.body;
  
    // Check if busId, routeId, and driverId are provided
    if (!busId || !routeId || !driverId) {
      return res.status(400).json({ error: 'Bus ID, Route ID, and Driver ID are required.' });
    }
  
    try {
      // Find the bus by busId
      const bus = await Bus.findOne({ busId: busId });
  
      if (!bus) {
        return res.status(404).json({ error: 'Bus not found' });
      }
  
      // If a new driver is assigned, update the driver history
      if (driverId) {
        // If there's already a current driver, update their end date in the history
        if (bus.currentDriverId) {
          bus.driverHistory.push({
            driverId: bus.currentDriverId, // Current driver
            assignedDate: bus.driverHistory[bus.driverHistory.length - 1].assignedDate, // Previous assigned date
            endDate: new Date(), // Set end date for the current driver
          });
        }
  
        // Update the currentDriverId with the new driver
        bus.currentDriverId = new mongoose.Types.ObjectId(driverId); // Assign new driver
        // Add the new driver to the history with the assigned date
        bus.driverHistory.push({
          driverId: new mongoose.Types.ObjectId(driverId),
          assignedDate: new Date(),
          endDate: null, // End date remains null for the currently assigned driver
        });
      }
  
      // Update the routeId if provided
      if (routeId) {
        bus.routeId = routeId;
      }
  
      // Save the updated bus
      await bus.save();
  
      // Return the updated bus details
      res.status(200).json(bus);
    } catch (error) {
      console.error('Error updating bus:', error);
      res.status(500).json({ error: 'An error occurred while updating bus details' });
    }
  });
  
  


  const connection = 'mongodb+srv://karthics22:rjrbT1Ez34SJvl22@dtc.lewp2.mongodb.net/?retryWrites=true&w=majority&appName=DTC';
  mongoose.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


  app.listen(5000, () => console.log('Server running on port 5000'));
