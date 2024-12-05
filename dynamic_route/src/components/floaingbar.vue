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
            <i class="fas fa-route"></i>
            <span v-if="isOpen"> Map</span>
          </li>
          <li @click="$router.push('/buses')">
            <i class="fas fa-bus"></i>
            <span v-if="isOpen"> Buses</span>
          </li>
          <li @click="$router.push('/routes')">
            <i class="fas fa-route"></i>
            <span v-if="isOpen"> Routes</span>
          </li>
          <li @click="$router.push('/depot')">
            <i class="fas fa-warehouse"></i>
            <span v-if="isOpen"> Depot</span>
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
        isOpen: false, // Tracks whether the sidebar is expanded
      };
    },
    methods: {
      toggleSidebar() {
        this.isOpen = !this.isOpen; // Toggle the sidebar state
        this.$emit("toggle-sidebar", this.isOpen); // Emit the sidebar state
      },
    },
  };
  </script>
  

  
<style scoped>
/* Sidebar Container */
.sidebar {
  position: fixed;
  top: 55px; /* Below the top bar */
  left: 0px;
  width: 40px; /* Default width for icons only */
  height: 100%;
  background-color: #222;
  color: white;
  overflow: hidden;
  transform: translateX(0);
  transition: width 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.sidebar.open {
  width: 120px; /* Expand width when open */
}

.sidebar ul {
  list-style: none;
  padding: 6px 10px;
}

.sidebar ul li {
  display: flex;
  align-items: center;
  margin: 15px 0;
  cursor: pointer;
  color: white;
  transition: color 0.3s ease;
  gap:10px;
}

.sidebar ul li:hover {
  color: #b7bcb8; /* Highlight color */
}

.sidebar ul li i {
  font-size: 20px;
  margin-right: 15px; /* Space between icon and text */
}

.sidebar ul li span {
  white-space: nowrap;
  font-size: 16px;
  display: inline-block;
  /* margin-right: 15px; */
}

/* Menu Button */
.menu-button {
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: #222;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1100;
  padding: 15px 10px;
  margin: 0px 0px 0px 0px;

}

.menu-button:focus {
  outline: none;
}
</style>

  