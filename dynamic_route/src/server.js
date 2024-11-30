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



const connection='mongodb://127.0.0.1:27017/Route-Ration'
mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('Error connecting to MongoDB:', err));


app.listen(5000, () => console.log('Server running on port 5000'));
