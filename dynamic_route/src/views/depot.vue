<template>
  <div id="main">
    <topbar />
      <floaingbar />
    <div class="top-sec">
     
      <h1 style="font-size: 22px;">Depot Management</h1>
      <div class="stats-container">
      
        <p>Total Depots: <strong>{{ totalDepots }}</strong></p>
        <p>Total Capacity: <strong>{{ totalCapacity }}</strong></p></div>

      <div class="filter-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by depot name..." 
          @input="filterDepots"
          class="search-input"
        />
        <!-- Add New Depot Icon -->
        <button
          class="add-depot-button"
          @click="handleAddDepotClick"
          title="Add New Depot"
        >+</button>
      </div>
    </div>

    <!-- Depot Cards -->
    <div class="depot-container">
      <div
        class="depot-card"
        v-for="depot in filteredDepots"
        :key="depot.id"
        @click="goToDepotDetail(depot.id)"
      >
        <h2>{{ depot.name }}</h2>
        <p>Total Capacity: {{ depot.capacity }}</p>
      </div>
    </div>

    <!-- Overlay for Adding New Depot -->
    <div v-if="showOverlay" class="overlay">
      <div class="overlay-content">
        <h2>Add New Depot</h2>
        <form @submit.prevent="addDepot">
          <input 
            type="text" 
            v-model="newDepot.name" 
            placeholder="Depot Name" 
            required 
          />
          <input 
            type="number" 
            v-model="newDepot.capacity" 
            placeholder="Capacity" 
            required 
          />
          <button type="submit">Add Depot</button>
        </form>
        <button class="close-button" @click="closeOverlay">Close</button>
      </div>
    </div>
  </div>
</template>


  
<script>
import axios from 'axios';
import floaingbar from "@/components/floaingbar.vue";
import topbar from "@/components/topbar.vue";

export default {
  name: 'DepotList',
  components: {
    topbar,
    floaingbar,
  },
  data() {
    return {
      depots: [],  // Original list of depots
      filteredDepots: [],  // Depots after applying search/filter
      searchQuery: '',  // Search query for depot name
      
      showOverlay: false,  // Flag to control overlay visibility
      newDepot: {
        name: '',
        capacity: '',
      }, // Data for new depot
      totalDepots: "<5",
    };
  },
  computed: {
    // Total number of depots
    totalDepots() {
      return this.filteredDepots.length;
    },
    // Total capacity of all depots
    totalCapacity() {
      return this.filteredDepots.reduce((sum, depot) => sum + parseInt(depot.capacity, 10), 0);
    }
  },
  methods: {
    handleAddDepotClick() {
      this.showOverlay = true;
    },
    async fetchDepots() {
      try {
        const response = await axios.get('http://localhost:5000/depots');
        this.depots = response.data;
        this.depots.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredDepots = this.depots; // Initially, display all depots
        this.filterDepots(); // Apply filtering immediately after loading data
      } catch (error) {
        console.error('Error fetching depots:', error);
      }
    },

    // Filter depots based on search query
    filterDepots() {
      let filtered = this.depots;
      if (this.searchQuery) {
        filtered = filtered.filter(depot => 
          depot.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      this.filteredDepots = filtered;
    },

    goToDepotDetail(depotId) {
      this.$router.push(`/depot/${depotId}`);
    },

    // Method to add new depot
    async addDepot() {
      if (!this.newDepot.id) {
        delete this.newDepot.id;  // MongoDB will auto-generate an _id
      }
      try {
        const response = await axios.post('http://localhost:5000/depots', this.newDepot);
        this.closeOverlay();  // Close the overlay after adding
        this.fetchDepots();   // Refresh the depots list
      } catch (error) {
        console.error('Error adding depot:', error);
      }
    },

    // Method to close the overlay
    closeOverlay() {
      this.showOverlay = false;
      this.newDepot = { name: '', capacity: '' };  // Reset form fields
    },
  },
  created() {
    this.fetchDepots();
  },
};
</script>

  
  <style scoped>
/* General Styles */
#main {
 
  min-height: 100vh;
  padding: 20px;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  margin: auto;
  width:100vw;
  height:100vh;
  margin-top:100px;
  background-color: #e0e1e3;
}

/* Top Section */
.top-sec {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
  text-align: left;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Stats Section */
.stats-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  width: 100%;
}

.stats-container p {
  font-size: 1.2rem;
  margin: 0;
  color: #7f8c8d;
}

.stats-container strong {
  font-size: 1.4rem;
  color: #3498db;
}

/* Filter Section */
.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
  gap:10px;
}

.search-input {
  padding: 12px 20px;
  font-size: 1rem;
  width: calc(100% - 70px);
  border-radius: 30px;
  border: 1px solid #dfe6e9;
  background: #ffffff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
  border-color: #3498db;
}

.add-depot-button {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  background: linear-gradient(to right, #74b9ff, #0984e3);
  border-radius: 50%;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 10px; 
}

.add-depot-button:hover {
  transform: scale(1.15);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Depot Container */
.depot-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

/* Depot Card */
.depot-card {
  background: linear-gradient(to bottom, #ffffff, #ecf0f1);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.depot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.depot-card h2 {
  font-size: 1.4rem;
  color: #2980b9;
  margin-bottom: 10px;
}

.depot-card p {
  font-size: 1rem;
  color: #7f8c8d;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
 
}

.overlay-content h2 {
  font-size: 1.5rem;
  color: #3498db;
  margin-bottom: 20px;
}

.overlay-content input {
  margin-bottom: 15px;
  padding: 12px;
  width: 100%;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
}

.overlay-content input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.5);
}

.overlay-content button {
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 8px;
  background: linear-gradient(to right, #74b9ff, #3498db);
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.overlay-content button:hover {
  background: linear-gradient(to right, #0984e3, #3498db);
  transform: scale(1.05);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .stats-container,
  .filter-container {
    flex-direction: column;
    gap: 15px;
  }

  .add-depot-button {
    width: 100%;
    height: auto;
    border-radius: 10px;
    font-size: 1rem;
  }

  .depot-card {
    padding: 15px;
  }
}
  

</style>

  