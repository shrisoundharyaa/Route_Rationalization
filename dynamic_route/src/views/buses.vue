<template>
  <div class="main">
    <nav class="sidenav">
      <div class="back-arrow" @click="$router.push('/')">
        <i class="fa fa-arrow-left"></i>
      </div>

      <ul>
        <li @click="selectSection('identifyBus')">
          <i class="fa fa-bus" aria-hidden="true"></i> Identify Bus
        </li>
        <li @click="selectSection('busBunching')">
          <i class="fa fa-exchange" aria-hidden="true"></i> Bus Bunching
        </li>
      </ul>
    </nav>
    <div class="content">
      <div v-if="selectedSection === 'identifyBus'">
        <h2>Identify Bus</h2>
        <form @submit.prevent="submitBusId">
          <label for="busId">Enter Bus ID : </label>
          <input type="text" id="busId" v-model="busId" required class="styled-input" />
          <button type="submit" class="styled-button">Submit</button>
        </form>
        <!-- Display the data in a table -->
        <table v-if="vehicleData.length > 0" class="data-table">
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Trip ID</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicle in vehicleData" :key="vehicle.vehicle_id">
              <td>{{ vehicle.vehicle_id }}</td>
              <td>{{ vehicle.trip_id }}</td>
              <td>{{ vehicle.latitude }}</td>
              <td>{{ vehicle.longitude }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div v-if="selectedSection === 'busBunching'">
        <h2>Bus Bunching</h2>
        <p>This section will show information related to bus bunching.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusManagement',
  data() {
    return {
      selectedSection: 'identifyBus',
      busId: '',
      vehicleData: [], // Array to hold the vehicle data
      errorMessage: null, // To store error messages
    };
  },
  methods: {
    selectSection(section) {
      this.selectedSection = section;
    },
    async submitBusId() {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/vehicle-positions?vehicle_id=${this.busId}`
        );
        const data = await response.json();

        if (response.ok) {
          if (data.length > 0) {
            this.vehicleData = data; // Populate the table with data
            this.errorMessage = null; // Clear any error messages
          } else {
            this.vehicleData = [];
            this.errorMessage = 'No matching bus found.';
          }
        } else {
          this.vehicleData = [];
          this.errorMessage = data.error || 'Error fetching vehicle data.';
        }
      } catch (error) {
        console.error('Error fetching vehicle location:', error);
        this.vehicleData = [];
        this.errorMessage = 'Unable to connect to the server.';
      }
    },
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
