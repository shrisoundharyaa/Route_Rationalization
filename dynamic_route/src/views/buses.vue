<template>
  <div class="main">
    <topbar />
    <floaingbar />
    <div class="content">
      <div v-if="selectedSection === 'allBuses'">
        <h2>All Buses</h2>
        <div class="filters">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search buses by ID or Registration Number"
            class="styled-input"
          />
          <select v-model="selectedStatus" class="filter-select">
            <option value="">All Status</option>
            <option value="running">Running</option>
            <option value="in depot">In Depot</option>
            <option value="under maintenance">Under Maintenance</option>
          </select>
        </div>
        <table v-if="filteredBuses.length > 0" class="data-table">
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Registration Number</th>
              <th>Route ID</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bus in filteredBuses" :key="bus.busId">
              <td>{{ bus.busId }}</td>
              <td>{{ bus.registrationNumber }}</td>
              <td>{{ bus.routeId }}</td>
              <td>{{ bus.currentDriverId ? bus.currentDriverId.name : 'Unassigned' }}</td>
              <td>{{ bus.status }}</td>
              <td>{{ bus.capacity }}</td>
              <td>
                <button @click="openEditModal(bus)" class="styled-button">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="modal-overlay">
        <div class="modal">
          <h3>Edit Bus Details</h3>
          <form @submit.prevent="submitEditForm">
            <label for="routeId">Route ID:</label>
            <input
              type="text"
              v-model="editForm.routeId"
              id="routeId"
              placeholder="Enter new Route ID"
            />
            <label for="driverId">Driver:</label>
            <select v-model="editForm.driverId" id="driverId">
              <option value="" disabled>Select a driver</option>
              <option v-for="driver in drivers" :value="driver._id" :key="driver._id">
                {{ driver.name }}
              </option>
            </select>
            <div class="modal-actions">
              <button type="submit" class="styled-button">Save</button>
              <button @click="closeEditModal" class="styled-button cancel-button">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import floaingbar from "@/components/floaingbar.vue";
import topbar from "@/components/topbar.vue";

export default {
  name: "BusManagement",
  components: {
    topbar,
    floaingbar,
  },
  data() {
    return {
      selectedSection: "allBuses",
      allBuses: [],
      searchQuery: "",
      selectedStatus: "", 
      errorMessage: null,
      showEditModal: false, // To control the visibility of the modal
      editForm: {
        busId: null,
        routeId: "",
        driverId: "",
      },
      drivers: [], // Holds all driver data
    };
  },
  computed: {
    filteredBuses() {
      const query = this.searchQuery.toLowerCase();
      return this.allBuses.filter((bus) => {
        const matchesQuery =
          bus.busId.toLowerCase().includes(query) ||
          bus.registrationNumber.toLowerCase().includes(query);
        const matchesStatus =
          this.selectedStatus === "" || bus.status === this.selectedStatus;
        return matchesQuery && matchesStatus;
      });
    },
  },
  methods: {
    selectSection(section) {
      this.selectedSection = section;
    },
    async fetchAllBuses() {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/getAllBuses");
        const data = await response.json();
        if (response.ok) {
          this.allBuses = data;
          this.errorMessage = null;
        } else {
          this.allBuses = [];
          this.errorMessage = data.error || "Error fetching bus data.";
        }
      } catch (error) {
        console.error("Error fetching all buses:", error);
        this.allBuses = [];
        this.errorMessage = "Unable to connect to the server.";
      }
    },
    async fetchDrivers() {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/getAllDrivers");
        const data = await response.json();
        if (response.ok) {
          this.drivers = data;
        } else {
          console.error("Error fetching drivers:", data.error);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    },
    openEditModal(bus) {
      this.editForm.busId = bus.busId;
      this.editForm.routeId = bus.routeId;
      this.editForm.driverId = bus.currentDriverId || "";
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editForm = {
        busId: null,
        routeId: "",
        driverId: "",
      };
    },
    async submitEditForm() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/editBus`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.editForm),
        });
        const data = await response.json();
        if (response.ok) {
          await this.fetchAllBuses(); // Refresh bus data
          this.closeEditModal();
        } else {
          console.error("Error updating bus:", data.error);
        }
      } catch (error) {
        console.error("Error updating bus:", error);
      }
    },
  },
  mounted() {
    this.fetchAllBuses();
    this.fetchDrivers(); // Fetch driver list when the component is mounted
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.filters {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 10px;
  border-radius: 25px;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.filter-select:focus {
  outline: none;
  border-color: #0d6efd;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  width: 400px;
  max-width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-button {
  background-color: red;
}

label {
  display: block;
  margin-top: 10px;
}

input,
select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

button {
  cursor: pointer;
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
