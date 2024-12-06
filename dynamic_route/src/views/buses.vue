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
.main {
  display: flex;
  height: 100vh;
  background-color: rgb(39, 39, 39);
}

.sidenav {
  height: 100vh;
  width: 250px;
  background-color: black;
  color: white;
  padding-top: 20px;
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.319);
  transition: width 0.3s ease;
}

.back-arrow {
  font-size: 24px;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  padding-left: 10px;
}

.sidenav ul {
  list-style-type: none;
  padding: 0;
}

.sidenav li {
  font-weight: 600;
  font-size: 17px;
  padding: 15px;
  cursor: pointer;
}

.sidenav li:hover {
  background-color: #acacac;
  border-radius: 10px;
}

.sidenav li i {
  margin-right: 10px;
}

.content {
  margin-left: 270px;
  padding: 20px;
  width: 1266px;
  background-color: rgb(39, 39, 39);
  color: white;
}

table.data-table {
  margin-top: 20px;
  width: 100%;
  border-collapse: collapse;
}

table.data-table th,
table.data-table td {
  border: 1px solid white;
  text-align: left;
  padding: 8px;
}

table.data-table th {
  background-color: #333;
  color: white;
}

.styled-input {
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid white;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  width: 250px;
  transition: all 0.3s ease;
}

.styled-input:focus {
  outline: none;
  border-color: #00bcd4;
  background-color: rgba(255, 255, 255, 0.2);
}

.styled-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #df751f;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* .styled-button:hover {
  background-color: #891192;
} */

.error {
  color: red;
  margin-top: 10px;
}
</style>
