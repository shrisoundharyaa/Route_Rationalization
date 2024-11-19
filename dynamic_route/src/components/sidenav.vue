<template>
  <div class="main">
    <nav class="sidenav">
      <div class="top-section">
        <!-- Add other sidebar content here if needed -->
      </div>
      <ul class="bottom-menu">
        <li>Map</li>
        <li @click="$router.push('/buses')">Buses</li>
        <li>Routes</li>
        <li>Analytics</li>
      </ul>
    </nav>
    <div class="content">
      <!-- Content of the page goes here -->
    </div>
  </div>
</template>

  
  <script>
  export default {
    name: 'Sidebar',
    methods: {}
  }
  </script>
  
  <style scoped>
.sidenav {
  height: 670px;
  border-radius: 10px;
  width: 300px;
  background-color: rgb(44, 44, 44);
  color: rgb(255, 255, 255);
  padding: 20px;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensure space between top and bottom sections */
  top: 20px;
  left: 20px;
  z-index: 1000;
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.319);
  transition: width 0.3s ease;
}

.bottom-menu {
  display: flex; /* Arrange items in a row */
  justify-content: space-around; /* Distribute items evenly */
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* Optional separator line */
}

.bottom-menu li {
  font-weight: 600;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
}

.bottom-menu li:hover {
  background-color: #acacac;
  border-radius: 5px;
}
</style>
