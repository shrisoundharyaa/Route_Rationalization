<template>
  <div class="main">
    <nav class="sidenav">
      <div class="back-arrow" @click="$router.push('/')">
        <i class="fa fa-arrow-left"></i>
      </div>

      <ul>
        <li @click="selectSection('identifyBus')">
          <i class="fas fa-bus"></i> Identify Bus
        </li>
        <li @click="selectSection('busBunching')">
          <i class="fas fa-chart-line"></i> Bus Bunching
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "BusManagement",
  data() {
    return {
      selectedSection: "identifyBus",
    };
  },
  methods: {
    selectSection(section) {
      this.selectedSection = section;
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

/* Sidebar Styles */
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
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3);
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
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidenav li i {
  font-size: 20px;
}

.sidenav li:hover {
  background-color: #acacac;
  border-radius: 10px;
}
</style>
