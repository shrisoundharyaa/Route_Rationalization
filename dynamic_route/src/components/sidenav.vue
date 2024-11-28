<template>
  <div class="main">
    <nav class="sidenav">
      
      <div class="top-section"></div>
      <div class="selected-bus" v-if="selectedBus">
        <div class="bus-card">
          <p><strong>Driver Name:</strong></p>
          <div class="value">{{ selectedBus.details.driverName }}</div>
        </div>
        <div class="bus-card">
          <p><strong>Source:</strong></p>
          <div class="value">{{ selectedBus.details.source }}</div>
        </div>
        <div class="bus-card">
          <p><strong>Destination:</strong></p>
          <div class="value">{{ selectedBus.details.destination }}</div>
        </div>
        <div class="bus-card-s">
          <div class="value"><strong>Bus ID:</strong> {{ selectedBus.details.busId }}</div>
          <div class="value"><strong>Route ID:</strong> {{ selectedBus.details.routeId }}</div>
        </div>
        <div class="bus-card">
          <p><strong>Delay Time:</strong></p>
          <div class="value">{{ selectedBus.details.delayTime }} mins</div>
        </div>
        <button @click="$emit('closeOverlay')">Close Details</button>
      </div>
      <div class="middle-section" v-else>
        <!-- Updated congestion and accident levels -->
        <div class="back-arrow" @click="$router.push('/')">
        <i class="fa fa-arrow-left"></i>
      </div>
        <ul class="status-list">
          <li class="status-item high">
            <i class="fas fa-traffic-light"></i> High Congestion
            <p class="between">44</p>
          </li>
          <li class="status-item medium">
            <i class="fas fa-road"></i> Medium Congestion
            <p class="between">67</p>
          </li>
          <li class="status-item low">
            <i class="fas fa-car-side"></i> Low Congestion
            <p class="between">34</p>
          </li>
          <li class="status-item accident">
            <i class="fas fa-exclamation-triangle"></i> Accident
            <p class="between">5</p>
          </li>
        </ul>
      </div>
    </nav>
    <div class="content">
      <!-- Content of the page goes here -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    selectedBus: {
      type: Object,
      required: false,
    },
  },
};
</script>

<style scoped>
/* .sidenav {
  height: 670px;
  border-radius: 10px;
  width: 250px;
  background-color: #2c2c2c;
  color: #fff;
  padding: 20px;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 20px;
  left: 20px;
  
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.319);
 
  transition: all 0.3s ease;
} */

.sidenav::-webkit-scrollbar {
  display: none;
}

.sidenav {
  scrollbar-width: none;
}
.sidebar .back-arrow {
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 20px;
}
.back-arrow {
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 20px;
}

.selected-bus {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 5px;
  background-color: #2c2c2c;
  margin-bottom: 20px;
}

.bus-card {
  padding: 10px 15px;
  border-radius: 8px;
  background-color: #3c3c3c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.bus-card-s {
  padding: 10px 15px;
  border-radius: 8px;
  background-color: #3c3c3c;
  display: flex;
  justify-content: space-between;
}

.bus-card .value {
  margin-top: 5px;
  padding: 10px;
  color: #fff;
  border-radius: 5px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
}

.bus-card-s .value {
  margin-right: 10px;
}

.selected-bus button {
  padding: 10px 15px;
  font-size: 14px;
  color: white;
  background-color: rgb(255, 77, 77);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-end;
  transition: all 0.3s;
}

.selected-bus button:hover {
  background-color: rgb(255, 99, 71);
}

.middle-section {
  margin-bottom: 250px;
}

.status-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.status-item {
  font-size: 14px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.status-item.high {
  background-color: rgb(255, 77, 77);
}

.status-item.medium {
  background-color: rgb(255, 165, 0);
}

.status-item.low {
  background-color: rgb(144, 238, 144);
}

.status-item.accident {
  background-color: rgb(255, 99, 71);
}

.status-item:hover {
  opacity: 0.8;
}

.between {
  margin-left: auto;
  font-weight: bold;
}
</style>
