<template>
    <div class="main">
      <h1>Depot Details</h1>
      <div v-if="depot" class="depot-details">
        <h2>{{ depot.name }}</h2>
        <p><strong>Total Capacity:</strong> {{ depot.capacity }}</p>
       

        <button @click="goBack">Go Back</button>
      </div>
      <div v-else>
        <p>Loading depot details...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'DepotDetail',
    data() {
      return {
        depot: null,
      };
    },
    created() {
      this.fetchDepotDetail();
    },
    methods: {
      async fetchDepotDetail() {
        const depotId = this.$route.params.id; 
        console.log('Depot ID:', depotId);
        try {
          const response = await axios.get(`http://localhost:5000/depots/${depotId}`);
          this.depot = response.data; // Set the depot data
        } catch (error) {
          console.error('Error fetching depot details:', error);
        }
      },
      goBack() {
        this.$router.push('/depot'); // Navigate back to the main depot list page
      },
    },
  };
  </script>
  
  <style scoped>
  /* General page style */
  .main {
    background-color: #1c1c1c;
    color: #f1f1f1;
    font-family: 'Arial', sans-serif;
    padding: 20px;
    min-height: 100vh;
    min-width: 100vw;
  }
  
  h1 {
    color: #ffd700;
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  /* Depot Details Box */
  .depot-details {
    background-color: #2e2e2e;
    color: #f1f1f1;
    padding: 2rem;
    border-radius: 10px;
    max-width: 900px;
    margin: 0 auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .depot-details h2 {
    color: #ffd700;
    margin-bottom: 20px;
    font-size: 2rem;
  }
  
  .depot-details p {
    font-size: 1.2rem;
    margin: 10px 0;
  }
  
  .depot-details h3 {
    font-size: 1.4rem;
    margin-top: 20px;
    color: #88c;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  .bus-item {
    background-color: #444;
    color: #f1f1f1;
    margin: 8px 0;
    padding: 10px;
    border-radius: 6px;
    transition: background-color 0.3s;
  }
  
  .bus-item:hover {
    background-color: #555;
  }
  
  .bus-item span {
    display: block;
    margin: 5px 0;
  }
  
  button {
    background-color: #444;
    color: #f1f1f1;
    border: 1px solid #555;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
    border-radius: 6px;
    font-size: 1.1rem;
    width: 100%;
    max-width: 150px;
    margin-left: auto;
    margin-right: auto;
  }
  
  button:hover {
    background-color: #666;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .depot-details {
      padding: 1.5rem;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .depot-details h2 {
      font-size: 1.8rem;
    }
    
    button {
      font-size: 1rem;
    }
  }
  </style>
  