const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Depot = require('./models/depot.js')


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



const connection = 'mongodb+srv://karthics22:rjrbT1Ez34SJvl22@dtc.lewp2.mongodb.net/?retryWrites=true&w=majority&appName=DTC';
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('Error connecting to MongoDB:', err));


app.listen(5000, () => console.log('Server running on port 5000'));
