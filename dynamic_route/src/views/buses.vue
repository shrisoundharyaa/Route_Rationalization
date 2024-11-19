<template>
    <div class="main">
      <nav class="sidenav">
        <div class="back-arrow" @click="$router.push('/')">
          <i class="fa fa-arrow-left"></i>
        </div>
  
        <ul>
          <li @click="selectSection('identifyBus')">Identify Bus</li>
          <li @click="selectSection('busBunching')">Bus Bunching</li>
        </ul>
      </nav>
      <div class="content">
        <div v-if="selectedSection === 'identifyBus'">
          <h2>Identify Bus</h2>
          <form @submit.prevent="submitBusId">
            <label for="busId">Enter Bus ID :  </label>
            <input type="text" id="busId" v-model="busId" required />
            <button type="submit">Submit</button>
          </form>
          <p v-if="submittedBusId">You entered Bus ID : {{ submittedBusId }}</p>
        </div>
        
        <div v-if="selectedSection === 'busBunching'">
          <h2>Bus Bunching</h2>
          <p>This section will show information related to bus bunching.</p>
        </div>
      </div>
    </div>
  </template>
  
  
<script>
export default {
  name: 'BusManagement',
  data() {
    return {
      selectedSection: 'identifyBus',
      busId: '', 
      submittedBusId: '', 
    };
  },
  methods: {
    // Method to handle section change
    selectSection(section) {
      this.selectedSection = section;
    },
    // Method to handle bus ID form submission
    submitBusId() {
      this.submittedBusId = this.busId;
      this.busId = ''; // Clear input field after submission
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
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.319);
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
}

.sidenav li:hover {
  background-color: #acacac;
  border-radius: 10px;
}

.content {
  margin-left: 270px;
  padding: 20px;
  width: 1266px; 
  background-color: rgb(39, 39, 39); /* Content background matches the page */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align content to the top */
}

form {
  margin-top: 10px;
}

input[type="text"] {
  padding: 8px;
  font-size: 14px;
  margin-right: 10px;
}

button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
