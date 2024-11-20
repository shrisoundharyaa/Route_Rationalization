<template>
  <div class="main">
    <nav class="sidenav">
      <div class="top-section"></div>
      <div class="middle-section">
        <!-- Add congestion and accident levels -->
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
      
      <ul class="bottom-menu">
        <li>
          <i class="fas fa-map-marker-alt"></i> 
          <p>Map</p>
        </li>
        <li @click="$router.push('/buses')">
          <i class="fas fa-bus"></i> Buses
        </li>
        <li @click="$router.push('/routes')">
          <i class="fas fa-route"></i> Routes
        </li>
        <li>
          <i class="fas fa-chart-line"></i> Analytics
        </li>
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
};
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
  justify-content: space-between;
  top: 20px;
  left: 20px;
  z-index: 1000;
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.319);
  transition: width 0.3s ease;
}

.middle-section {
  margin-bottom: 250px;
}
/* .top-section{
  margin-top: 20px;
} */
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

.status-item i {
  font-size: 18px;
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

.bottom-menu {
  display: flex;
  justify-content: space-around;
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.bottom-menu li {
  font-weight: 600;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.bottom-menu li:hover {
  background-color: #3f3e3e;
  border-radius: 5px;
}

.bottom-menu i {
  font-size: 18px;
}
.between {
  margin-left: auto;
  font-weight: bold; 
}

</style>
