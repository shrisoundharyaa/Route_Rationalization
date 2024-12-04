<template>
  <div id="main">
    <div class="top-sec">
    <h1>Depot Management</h1>
    <div class="filter-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by depot name..." 
        @input="filterDepots"
        class="search-input"
      />
      <select v-model="busFilter" @change="filterDepots" class="filter-select">
        <option value="">Filter by Number of Buses</option>
        <option value="1">1 Bus</option>
        <option value="5">5 Buses</option>
        <option value="10">10 Buses</option>
        <option value="20">20+ Buses</option>
      </select>

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
      busFilter: '',  // Filter for number of buses
      showOverlay: false,  // Flag to control overlay visibility
      newDepot: {
        name: '',
        capacity: '',
      }, // Data for new depot
    };
  },
  methods: {
    handleAddDepotClick() {
      console.log('Add icon clicked');
      this.showOverlay = true;
    },
    async fetchDepots() {
      try {
        const response = await axios.get('http://localhost:5000/depots');
        console.log('Depots fetched:', response.data);
        this.depots = response.data;
        this.filteredDepots = this.depots; // Initially, display all depots
        this.filterDepots(); // Apply filtering immediately after loading data
      } catch (error) {
        console.error('Error fetching depots:', error);
      }
    },

    // Filter depots based on search and bus count
    filterDepots() {
      let filtered = this.depots;

      // Filter by depot name (case insensitive search)
      if (this.searchQuery) {
        filtered = filtered.filter(depot => 
          depot.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Filter by number of buses
      if (this.busFilter) {
        filtered = filtered.filter(depot => {
          const busCount = depot.buses.length;
          if (this.busFilter === '1') return busCount === 1;
          if (this.busFilter === '5') return busCount <= 5;
          if (this.busFilter === '10') return busCount >= 10;
          if (this.busFilter === '20') return busCount >= 20;
          return true;
        });
      }

      // Set the filtered depots
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
      this.newDepot = { name: '', location: '', capacity: '' };  // Reset form fields
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
    background-color: #333;
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* Title */
  h1 {
    color: #ffffff;
    font-size: 2.5rem;
    margin-bottom: 20px;
    margin-left: 10px;
  }
  
  /* Search and Filter Section */
  .filter-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 20px;
  }
  
  .search-input {
    padding: 10px;
    font-size: 1rem;
    width: 250px;
    border-radius: 5px;
    border: 1px solid #444;
  }
  
  .filter-select {
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #444;
  }
  .top-sec{
    background: #000000;
    width: 100vw;
  }
  
  /* Depot Container */
  .depot-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 20px;
    padding: 0 20px;
  }
  
  /* Depot Card Styles */
  .depot-card {
    background-color: #000000;
    color: #f1f1f1;
    border: 1px solid #444;
    padding: 1.5rem;
    width: 250px;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    font-size: 1rem;
    text-transform: capitalize;
  }
  .add-depot-button {
  background-color: #4CAF50;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.add-depot-button:hover {
  background-color: #45a049;
}
  
  .depot-card:hover {
    background-color: #444;
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }
  
  .depot-card h2 {
    font-size: 1.6rem;
    color: #ffd700;
    margin-bottom: 10px;
  }
  
  .depot-card p {
    color: #ddd;
    margin: 5px 0;
  }
  
  /* Card Details */
  .depot-card p:first-child {
    font-weight: bold;
  }
  
  .depot-card p:last-child {
    font-size: 1.1rem;
    color: #88c;
  }
  .close-button {
  background-color: #ff5c5c;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-top: 10px;
}
.close-button:hover {
  background-color: #ff2e2e;
}
  .overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.overlay-content input,
.overlay-content button {
  padding: 10px;
  font-size: 1rem;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #444;
}

  /* Mobile responsiveness */
  @media (max-width: 600px) {
    .depot-card {
      width: 100%;
      padding: 1rem;
    }
  
    .search-input, .filter-select {
      width: 100%;
      padding: 8px;
    }
  }
  </style>
  