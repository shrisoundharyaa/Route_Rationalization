<template>
  <div class="main">
    <h1>Depot Details</h1>
    <topbar />
    <floaingbar />

    <!-- Depot and Search/Add Container Row -->
    <div class="depot-search-container">
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
import floaingbar from "@/components/floaingbar.vue";
import topbar from "@/components/topbar.vue";
export default {
  name: 'DepotDetails',
  components: {
    topbar,
    floaingbar,
  },
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

<<style scoped>
.main {
  background-color: #e0e1e3;
  color: #18181b;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 100vw;
  margin-top: 100px;
  margin-left: 35px;
}

/* Row layout for Depot Details and Search/Add Container */
.depot-search-container {
  display: flex; /* Flexbox to align children horizontally */
  justify-content: space-between; /* Space between the two containers */
  align-items: flex-start; /* Align items at the top */
  gap: 20px;
  width: 90%;
  max-width: 1200px;
}

/* Depot Details Box */
.depot-details {
  flex: 1; /* Take up equal space */
  max-width: 40%; /* Adjust maximum width */
  background-color: #ffffff;
  color: #18181b;
  padding: 15px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
}

.depot-details h2 {
  font-size: 1.4rem;
  margin: 0 0 10px 0;
}

.depot-details p {
  margin: 5px 0;
  font-size: 1rem;
  line-height: 1.4;
}

/* Search bar and Add Bus button container */
.search-add-container {
  flex: 1; /* Take equal space */
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.search-bar {
  flex: 1;
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid rgba(128, 128, 128, 0.233);
  color: #18181b;
  background-color: #fbfbfb;
  font-size: 1rem;
}

.search-bar::placeholder {
  color: #8b949e;
}

.add-bus-btn {
  background-color: #12c5d1;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.add-bus-btn:hover {
  background-color: #353f80;
}

/* Bus List Table */
.buses-list {
  width: 90%;
  max-width: 900px;
  margin-top: 30px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

table th,
table td {
  padding: 15px;
  text-align: center;
  font-size: 1rem;
}

table th {
  background-color: #ecebf3;
  font-size: 1.1rem;
  color: #353f80;
}

table td {
  background-color: #fbfbfb;
  color: #18181b;
}

button {
  background-color: #e5e3f3;
  color: #18181b;
  border: 1px solid rgba(128, 128, 128, 0.233);
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #12c5d1;
  color: #ffffff;
}

/* Overlay for Add Bus Form */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-container {
  background-color: #ffffff;
  color: #18181b;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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

input,
select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(128, 128, 128, 0.233);
  color: #18181b;
  background-color: #fbfbfb;
  font-size: 1rem;
}

input:focus,
select:focus {
  border-color: #12c5d1;
}

button[type="submit"] {
  width: 100%;
  background-color: #12c5d1;
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #353f80;
}

/* Responsive Design */
@media (max-width: 768px) {
  .depot-search-container {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  .depot-details {
    max-width: 100%;
  }

  table th,
  table td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .form-container {
    width: 95%;
  }
}

</style>
