<template>
  <div class="main">
    <h1>Depot Details</h1>
    
    <!-- Depot Details -->
    <div v-if="depot" class="depot-details">
      <h2>{{ depot.name }}</h2>
      <p><strong>Total Capacity:</strong> {{ depot.capacity }}</p>
      <p><strong>Location:</strong> {{ depot.location }}</p>
    </div>
    
    <!-- Search Bar and Add Bus Button -->
    <div class="search-add-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search Buses..."
        class="search-bar"
      />
      <button @click="showAddBusForm" class="add-bus-btn">Add Bus</button>
    </div>

    <!-- Bus List Table -->
    <div class="buses-list" v-if="buses.length > 0">
      <table>
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Route ID</th>
            <th>Bus ID</th>
            <th>Status</th>
            <th>Delay Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bus in filteredBuses" :key="bus.busId">
            <td>{{ bus.registrationNumber }}</td>
            <td>{{ bus.routeId }}</td>
            <td>{{ bus.busId }}</td>
            <td>{{ bus.status }}</td>
            <td>{{ bus.delayTime }} mins</td>
            <td><button @click="editBus(bus.busId)">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Bus Overlay (Modal) -->
    <div v-if="showForm" class="overlay" @click="showForm = false">
      <div class="form-container" @click.stop>
        <h3>Add Bus</h3>
        <form @submit.prevent="addBus">
          <div class="form-group">
            <label for="registrationNumber">Registration Number</label>
            <input type="text" id="registrationNumber" v-model="bus.registrationNumber" required />
          </div>

          <div class="form-group">
            <label for="routeId">Route ID</label>
            <input type="text" id="routeId" v-model="bus.routeId" required />
          </div>

          <div class="form-group">
            <label for="busId">Bus ID</label>
            <input type="text" id="busId" v-model="bus.busId" required />
          </div>

          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="bus.status" required>
              <option value="running">Running</option>
              <option value="under maintenance">Under Maintenance</option>
              <option value="in depot">In Depot</option>
            </select>
          </div>

          <div class="form-group">
            <label for="delayTime">Delay Time (minutes)</label>
            <input type="number" id="delayTime" v-model="bus.delayTime" required />
          </div>

          <div class="form-group">
            <label for="capacity">Capacity</label>
            <input type="number" id="capacity" v-model="bus.capacity" required />
          </div>

          <div class="form-group">
            <label for="depotId">Depot ID</label>
            <input type="text" id="depotId" v-model="bus.depotId" required />
          </div>

          <button type="submit">Add Bus</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DepotDetails',
  data() {
    return {
      depot: null,
      buses: [],
      bus: {
        registrationNumber: '',
        routeId: '',
        busId: '',
        status: 'in depot',
        delayTime: 0,
        capacity: 0,
        depotId: this.$route.params.id,
      },
      searchQuery: '',
      showForm: false,
    };
  },
  computed: {
    filteredBuses() {
      return this.buses.filter(bus => 
        bus.registrationNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        bus.routeId.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  created() {
    this.fetchDepotDetail();
    this.fetchBuses();
  },
  methods: {
    async fetchDepotDetail() {
      try {
        const depotId = this.$route.params.id; // Assuming depot ID is passed as route parameter
        const response = await axios.get(`http://localhost:5000/depots/${depotId}`);
        this.depot = response.data;
      } catch (error) {
        console.error('Error fetching depot details:', error);
      }
    },
    async fetchBuses() {
      try {
        const depotId = this.$route.params.id;
        const response = await axios.get(`http://localhost:5000/buses?depotId=${depotId}`);
        this.buses = response.data;
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    },
    async addBus() {
      try {
        const response = await axios.post('http://localhost:5000/buses', this.bus);
        console.log('Bus added successfully:', response.data);
        this.buses.push(response.data); // Add the new bus to the list
        this.showForm = false; // Hide the form after submission
      } catch (error) {
        console.error('Error adding bus:', error);
      }
    },

    showAddBusForm() {
      this.showForm = !this.showForm; // Toggle form visibility
    },
    editBus(busId) {
      console.log(`Editing bus with ID: ${busId}`);
      // Implement the logic to edit the bus
    },
  },
};
</script>

<style scoped>
.main {
  background-color: #0d1117;
  color: #c9d1d9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 100vw;
}

/* Depot Details Box */
.depot-details {
  background-color: #161b22;
  color: #c9d1d9;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 900px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.depot-details h2 {
  margin-bottom: 10px;
  font-size: 1.8rem;
  text-align: center;
}

.depot-details p {
  margin: 5px 0;
  font-size: 1.1rem;
}

/* Search bar and Add Bus button container */
.search-add-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 90%;
  max-width: 900px;
}

.search-bar {
  flex: 1;
  padding: 10px 15px;
  border-radius: 6px;
  border: none;
  color: #c9d1d9;
  background-color: #21262d;
  font-size: 1rem;
}

.search-bar::placeholder {
  color: #8b949e;
}

.add-bus-btn {
  background-color: #238636;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.add-bus-btn:hover {
  background-color: #2ea043;
}

/* Bus List Table */
.buses-list {
  width: 90%;
  max-width: 900px;
  margin-top: 30px;
  background-color: #161b22;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

table th, table td {
  padding: 15px;
  border: 1px solid #21262d;
  text-align: center;
  font-size: 1rem;
  color: #c9d1d9;
}

table th {
  background-color: #21262d;
  font-size: 1.1rem;
}

table tr:nth-child(even) {
  background-color: #161b22;
}

table tr:hover {
  background-color: #2d333b;
}

button {
  background-color: #30363d;
  color: #c9d1d9;
  border: 1px solid #444c56;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3f4955;
}

/* Overlay for Add Bus Form */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(13, 17, 23, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-container {
  background-color: #161b22;
  color: #c9d1d9;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.form-container h3 {
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
}

input, select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: none;
  color: #c9d1d9;
  background-color: #21262d;
  font-size: 1rem;
}

input:focus, select:focus {
  outline: none;
  border-color: #238636;
}

button[type="submit"] {
  width: 100%;
  background-color: #238636;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #2ea043;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-add-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  table th, table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .form-container {
    width: 95%;
  }
}

</style>
