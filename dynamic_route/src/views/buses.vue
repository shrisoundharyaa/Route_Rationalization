<template>
  <div class="main">
    <topbar />
    <floaingbar />
    
      <!-- <div class="back-arrow" @click="$router.push('/')">
        <i class="fa fa-arrow-left"></i>
      </div> -->

      <!-- <ul>
        <li @click="selectSection('identifyBus')">
          <i class="fa fa-bus" aria-hidden="true"></i> Identify Bus
        </li>
        <li @click="selectSection('busBunching')">
          <i class="fa fa-exchange" aria-hidden="true"></i> Bus Bunching
        </li>
        <li @click="selectSection('allBuses')">
          <i class="fa fa-list" aria-hidden="true"></i> All Buses
        </li>
      </ul> -->
  
    <div class="content">
      <!-- All Buses Section -->
      <div v-if="selectedSection === 'allBuses'">
        <h2>All Buses</h2>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search buses by ID or Registration Number"
          class="styled-input"
        />
        <table v-if="filteredBuses.length > 0" class="data-table">
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Registration Number</th>
              <th>Route ID</th>
              <th>Status</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bus in filteredBuses" :key="bus.busId">
              <td>{{ bus.busId }}</td>
              <td>{{ bus.registrationNumber }}</td>
              <td>{{ bus.routeId }}</td>
              <td>{{ bus.status }}</td>
              <td>{{ bus.capacity }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import floaingbar from "@/components/floaingbar.vue";
import topbar from "@/components/topbar.vue";
export default {
  name: 'BusManagement',
  components: {
    topbar,
    floaingbar,
  },
  data() {
    return {
      selectedSection: 'allBuses', // Default section
      allBuses: [], // Holds all bus details
      searchQuery: '', // Holds the search input value
      errorMessage: null, // Error message if fetching fails
    };
  },
  computed: {
    filteredBuses() {
      // Filter buses based on search query (case-insensitive)
      const query = this.searchQuery.toLowerCase();
      return this.allBuses.filter(
        (bus) =>
          bus.busId.toLowerCase().includes(query) ||
          bus.registrationNumber.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    selectSection(section) {
      this.selectedSection = section;
    },
    async fetchAllBuses() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/getAllBuses');
        const data = await response.json();

        if (response.ok) {
          this.allBuses = data;
          this.errorMessage = null;
        } else {
          this.allBuses = [];
          this.errorMessage = data.error || 'Error fetching bus data.';
        }
      } catch (error) {
        console.error('Error fetching all buses:', error);
        this.allBuses = [];
        this.errorMessage = 'Unable to connect to the server.';
      }
    },
  },
  mounted() {
    // Fetch bus data when the component is mounted
    this.fetchAllBuses();
  },
};
</script>
<style scoped>
/* General Styling */
.main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #ece9e6, #ffffff);
  /* font-family: 'Arial', sans-serif; */
  color: #333;
  overflow: hidden;
  width: 100vw;
}

.content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  margin-left: 60px;
  margin-top:80px;
}

/* Table Styling */
table.data-table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

table.data-table th,
table.data-table td {
  border: 1px solid rgba(128, 128, 128, 0.233);
  text-align: left;
  padding: 12px 15px;
  font-size: 14px;
}

table.data-table th {
  background-color: #0d6efd;
  color: white;
  font-weight: bold;
}

table.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

table.data-table tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.1);
  transition: background-color 0.3s ease;
}

/* Input Styling */
.styled-input {
  padding: 10px;
  margin-right: 10px;
  border-radius: 25px;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
  color: #333;
  width: 300px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.styled-input:focus {
  outline: none;
  border-color: #0d6efd;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
}

/* Button Styling */
.styled-button {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background-color: #0d6efd;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.styled-button:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* Error Message */
.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
}

/* Section Header */
h2 {
  font-size: 24px;
  color: #0d6efd;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
