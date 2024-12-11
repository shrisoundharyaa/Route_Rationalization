<template>
  <div class="topbar">
    <div class="logo-container">
      <img src="../assets/dlc.logo.png" alt="Delhi Logo" class="topbar-logo" />
      <h1 class="topbar-title">Delhi Transport Corporation </h1>
    </div>
    <div class="logout-container">
      <i
        class="fas fa-sign-out-alt logout-icon"
        title="Logout"
        @click="handleLogout"
      ></i>
      <span class="logout-tooltip">Logout</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopBar",
  methods: {
    handleLogout() {
      alert("Logout action triggered!"); // Replace with your actual logout functionality
    },
  },
};
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #ecedf1; /* Light theme background */
  display: flex;
  align-items: center; /* Vertically center elements */
  justify-content: space-between; /* Space between elements */
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(99, 99, 99, 0.2);
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  position: relative;
}

.topbar-logo {
  height: 50px; /* Adjust for appropriate size */
  width: auto; /* Maintain aspect ratio */
}

.topbar-title {
 

  font-size: 16px;
  font-weight: bold;
  color: #0b0b0c;
  margin: 0;
  padding: 20px 20px;
  
}

.logout-container {
  position: relative;
  display: flex;
  align-items: center;
}

.logout-icon {
  font-size: 20px; /* Adjust icon size */
  color: #0b0b0c;
  cursor: pointer; /* Add pointer effect */
  transition: color 0.3s;
}

.logout-icon:hover {
  color: #5664c4; /* Change color on hover */
}

.logout-tooltip {
  display: none;
  position: absolute;
  top: 40px; /* Position below the icon */
  right: 0;
  background-color: #ecedf1;
  color: #0b0b0c;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(99, 99, 99, 0.2);
  white-space: nowrap;
}

.logout-container:hover .logout-tooltip {
  display: block;
}
</style>
