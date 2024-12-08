<template>
  <div class="main">
    <!-- Topbar and Floating Bar -->
    <topbar />
    <floaingbar />

    <!-- Depot Details -->
    <div v-if="depot" class="depot-details">
      <h1>Depot Details</h1>
      <div class="depot-row">
        <h2 style="text-transform: uppercase;">{{ depot.name }}</h2>
        <p><strong>Total Capacity:</strong> {{ depot.capacity }}</p>
        <p><strong>Location:</strong> {{ depot.location }}</p>
      </div>
    </div>

   

    <!-- Bus List Table -->
    <div class="buses-list" v-if="buses.length > 0">
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
            <td>
              <span :class="getStatusClass(bus.status)">
                <i :class="getStatusIcon(bus.status)"></i> {{ bus.status }}
              </span>
            </td>
            <td>{{ bus.delayTime }} mins</td>
            <td>
              <button @click="editBus(bus)" class="action-btn">Edit</button>
              <!-- <button @click="deleteBus(bus.busId)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Bus Overlay -->
    <div v-if="showForm" class="overlay" @click="closeForm">
      <div class="form-container" @click.stop>
        <h3>{{ editingBusId ? 'Edit Bus' : 'Add Bus' }}</h3>
        <form @submit.prevent="editingBusId ? updateBus() : addBus()">
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
          <button type="submit">{{ editingBusId ? 'Update Bus' : 'Add Bus' }}</button>
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
      editingBusId: null, // Used to track the bus being edited
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
    // Fetch depot details
    async fetchDepotDetail() {
      try {
        const depotId = this.$route.params.id;
        const response = await axios.get(`http://localhost:5000/depots/${depotId}`);
        this.depot = response.data;
      } catch (error) {
        console.error('Error fetching depot details:', error);
      }
    },

    // Fetch buses
    async fetchBuses() {
      try {
        const depotId = this.$route.params.id;
        const response = await axios.get(`http://localhost:5000/buses?depotId=${depotId}`);
        this.buses = response.data;
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    },

    // Show form to add a new bus
    showAddBusForm() {
      this.showForm = true;
      this.editingBusId = null; // Reset edit mode
      this.resetBusForm();
    },

    // Reset the form data
    resetBusForm() {
      this.bus = {
        registrationNumber: '',
        routeId: '',
        busId: '',
        status: 'in depot',
        delayTime: 0,
        capacity: 0,
        depotId: this.$route.params.id,
      };
    },

    // Add a new bus
    async addBus() {
      try {
        const response = await axios.post('http://localhost:5000/buses', this.bus);
        this.buses.push(response.data);
        this.showForm = false; // Close the form
        console.log('Bus added successfully:', response.data);
      } catch (error) {
        console.error('Error adding bus:', error);
      }
    },

    // Edit an existing bus
    editBus(bus) {
      this.showForm = true; // Show form
      this.editingBusId = bus.busId; // Set the ID of the bus being edited
      this.bus = { ...bus }; // Populate form with bus details
    },

    // Update an existing bus
    async updateBus() {
      try {
        await axios.put(`http://localhost:5000/buses/${this.editingBusId}`, this.bus);
        this.fetchBuses(); // Refresh the list after update
        this.showForm = false; // Close form
        console.log('Bus updated successfully');
      } catch (error) {
        console.error('Error updating bus:', error);
      }
    },

    // Delete a bus
    async deleteBus(busId) {
      try {
        await axios.delete(`http://localhost:5000/buses/${busId}`);
        this.buses = this.buses.filter(bus => bus.busId !== busId); // Remove bus from list
        console.log('Bus deleted successfully');
      } catch (error) {
        console.error('Error deleting bus:', error);
      }
    },

    // Get class for bus status
    getStatusClass(status) {
      switch (status) {
        case "running":
          return "text-success";
        case "under maintenance":
          return "text-warning";
        case "in depot":
          return "text-info";
        default:
          return "";
      }
    },

    // Get icon for bus status
    getStatusIcon(status) {
      switch (status) {
        case "running":
          return "fas fa-bus";
        case "under maintenance":
          return "fas fa-tools";
        case "in depot":
          return "fas fa-warehouse";
        default:
          return "";
      }
    },
  },
};
</script>



<style scoped>
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

.depot-details {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers horizontally */
  justify-content: center; /* Centers vertically */
  min-width: 95%;
  text-align: center;
  background-color: #f9fafb; /* Optional: Add a background color */
  padding: 0px;
  border-radius: 10px; /* Optional: Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Subtle shadow for better aesthetics */
}
.depot-details h1 {
    font-size: 2.0em;
    color: #333;
    text-align: center;
    margin-bottom: 2px;
    font-weight: bold;
}

.depot-row {
  display: flex;
  flex-wrap: wrap; /* Ensures proper alignment if content overflows */
  gap: 200px; /* Adds spacing between items */
  justify-content: space-between; /* Aligns items in the center horizontally */
  align-items: center; /* Aligns items in the center vertically */
  /* margin-top: 15px; */
  background-color: #ffffff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom:20px;
}

.depot-row h2 {
  font-size: 20px;
  color: #2a4d7d;
  margin: 0;
}

.depot-row p {
  font-size: 16px;
  color: #2a4d7d;
  margin: 10px;
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
  /* border: 100px solid rgba(128, 128, 128, 0.233); */
  border-radius:15px;
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
  background-color: #00eeff;
}

/* Bus List Table */
.buses-list {
  width: 100%;
  max-width: 95%;
  margin-top: 30px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  overflow-y: scroll;
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

.action-btn {
  background-color: #12c5d1; /* Button background color */
  color: #fff; /* Text color */
  border: 1px solid rgba(128, 128, 128, 0.233); /* Subtle border */
  padding: 10px 20px; /* Padding inside button */
  cursor: pointer; /* Show pointer on hover */
  border-radius: 6px; /* Rounded corners */
  font-size: 1rem; /* Font size */
  transition: background-color 0.3s; /* Smooth background color transition */
  display: inline-flex; /* Allows alignment of content (e.g., icon and text) */
  align-items: center; /* Vertically center content */
  justify-content: center; /* Horizontally center content */
  gap: 10px; /* Space between content if flex children exist */
}

/* Style for delete button */
.delete-btn {
  background: none; /* Remove any background color */
  border: none; /* Remove the border */
  color: #f44336; /* Red color for the delete action */
  font-size: 1.2rem; /* Adjust font size (for the icon) */
  cursor: pointer; /* Show pointer on hover */
  padding: 10px; /* Add padding around the content */
  display: inline-flex; /* Align the icon and text */
  align-items: center; /* Center icon vertically */
  justify-content: center; /* Center content horizontally */
  transition: color 0.3s; /* Smooth transition for color changes */
}

.delete-btn:hover {
  color: #e53935; /* Darker red on hover */
}

.delete-btn:active {
  color: #d32f2f; /* Even darker red on click */
}

.delete-btn i {
  margin-right: 8px; /* Space between the icon and text */
}
.action-btn:hover {
  background-color: #0d9aa7;
  color: #ffffff;
}

/* Overlay for Add Bus Form */
.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centers the modal perfectly */
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  
  /* margin-top:200px; */
}

.form-container {
  background-color: #ffffff;
  color: #18181b;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90%; /* Restrict the maximum height */
  overflow-y: auto; /* Enable vertical scrolling if content exceeds height */
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 15px;
  margin-top: 12%;
  margin-bottom: 10%;
  -ms-overflow-style: none;

}
::-webkit-scrollbar {
  display: none; /* Hide scrollbar */
}

.form-container h3 {
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.95rem;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  color: #18181b;
  background-color: #f9fafb;
  font-size: 0.95rem;
}

input:focus,
select:focus {
  border-color: #12c5d1;
  outline: none;
  box-shadow: 0 0 5px rgba(18, 197, 209, 0.3);
}

button[type="submit"] {
  width: 100%;
  background-color: #12c5d1;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #0d9aa7;
}

/* Keyframe for overlay animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.text-success {
  color: green;
}
.text-warning {
  color: rgb(255, 94, 0);
}
.text-info {
  color: #7f6bffdf;
}


/* Responsive Design */
@media (max-width: 768px) {
  .search-add-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

 
}
</style>
