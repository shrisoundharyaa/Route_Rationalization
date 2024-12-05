<template>
  <div id="main">
    <div class="top-sec">
      <h1>Depot Management</h1>
      <div class="stats-container">
        <p>Total Depots: <strong>{{ totalDepots }}</strong></p>
        <p>Total Capacity: <strong>{{ totalCapacity }}</strong></p>
      </div>
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

export default {
  name: 'DepotList',
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
  font-family: 'Arial', sans-serif;
  background: #000; /* Pure black background */
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #fff; /* White text */
}

/* Title */
h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #fff; /* Pure white title */
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.2); /* Soft glow effect */
}

/* Stats Section */
.stats-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.1); /* Semi-transparent white */
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 1.2rem;
}

.stats-container p {
  margin: 0;
}

.stats-container strong {
  color: #fff; /* White for contrast */
}

/* Filter Section */
.filter-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
}

.search-input {
  margin-top: 10px;
  padding: 12px;
  font-size: 1.1rem;
  width: 100%;
  max-width: 400px;
  border-radius: 25px;
  border: none;
  background: #333; 
  color: #fff; 
  outline: none;
}

.search-input:focus {
  background-color: #444;
}

.add-depot-button {
  background-color: #444; /* Dark gray */
  color: white;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-top: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.add-depot-button:hover {
  transform: scale(1.1);
}

/* Depot Container */
.depot-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 20px;
  padding: 0 10px;
}

/* Depot Card */
.depot-card {
  background: #111; /* Very dark gray */
  color: #fff; /* White text */
  border: 1px solid #333; /* Subtle border */
  padding: 20px;
  width: 300px;
  cursor: pointer;
  text-align: center;
  border-radius: 10px;
  
  overflow: hidden;
  position: relative;
}

.depot-card:hover {
  transform: translateY(-10px);
  background: #222; /* Slightly lighter gray */
}

.depot-card h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #fff; /* White for titles */
}

.depot-card p {
  font-size: 1.2rem;
  margin: 5px 0;
  color: #ccc; /* Light gray for descriptions */
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9); /* Black with slight transparency */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: #222; /* Very dark gray */
  color: #fff; /* White text */
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.overlay-content h2 {
  margin-bottom: 20px;
  color: #fff;
}

.overlay-content input,
.overlay-content button {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 1.1rem;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #444;
  background: #333; /* Dark gray */
  color: #fff;
}

.overlay-content button {
  background-color: #444;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.overlay-content button:hover {
  background-color: #555;
}

/* Close Button */
.close-button {
  background-color: #444;
  color: white;
  font-size: 1rem;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.close-button:hover {
  background-color: #555;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .depot-card {
    width: 100%;
    margin: 0;
  }

  .stats-container {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-container {
    flex-direction: column;
  }
}

</style>
  