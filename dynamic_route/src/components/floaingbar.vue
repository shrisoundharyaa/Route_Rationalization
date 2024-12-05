<template>
    <div>
      <!-- Sidebar Toggle Button -->
      <button class="menu-button" @click="toggleSidebar">
        ☰
      </button>
  
      <!-- Sidebar -->
      <div class="sidebar" :class="{ open: isOpen }">
        <ul>
            <li @click="$router.push('/real')">
          <i class="fas fa-route"></i> Map
        </li>   
            <li @click="$router.push('/buses')">
                <i class="fas fa-bus"></i> Buses
            </li>
            <li @click="$router.push('/routes')">
          <i class="fas fa-route"></i> Routes
        </li>
          <li @click="$router.push('/depot')">
            <i class="fas fa-warehouse"></i> Depot
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FloatingSidebar",
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      toggleSidebar() {
        this.isOpen = !this.isOpen;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Sidebar Container */
  .sidebar {
    position: fixed;
  top: 60; /* Below the top bar */
  left: 0;
  width: 100px;
  height: 100%;
  background-color: #222;
  color: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar ul {
    list-style: none;
    padding: 20px;
  }
  
  .sidebar ul li {
    margin: 15px 0;
  }
  
  .sidebar ul li a {
    color: white;
    text-decoration: none;
    font-size: 16px;
  }
  
  /* Menu Button */
  .menu-button {
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: #333;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 1100;
  }
  
  .menu-button:focus {
    outline: none;
  }
  </style>
  