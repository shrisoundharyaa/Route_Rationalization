<template>
  <div class="main">
    <nav class="sidenav">
     
    <div class="selected-bus" v-if="selectedBus">
     
        <div class="bus-card">
          <h1 class ="name">BUS Details </h1>
          <div class="val"><strong>Bus ID:</strong> {{ selectedBus.details.busId }}</div>
          <div class="val"><strong>Route ID:</strong> {{ selectedBus.details.routeId }}</div>
          <p><strong>Driver Name:</strong></p>
          <div class="value">{{ selectedBus.details.driverName }}</div>
          <p><strong>Source:</strong></p>
          <div class="value">{{ selectedBus.details.source }}</div>
          <p><strong>Destination:</strong></p>
          <div class="value">{{ selectedBus.details.destination }}</div>
         
          <p><strong>Delay Time:</strong></p>
          <div class="value">{{ selectedBus.details.delayTime }} mins</div>
          <div class="button">
          <button @click="$emit('closeOverlay')">Close Details</button>
        </div>
        </div>
  </div>
      
  
      <div class="middle-section" v-else>
        <!-- Updated congestion and accident levels -->
        <div class="back-arrow" @click="$router.push('/newdashboard')">
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

.back-arrow {
  font-size: 24px;
  cursor: pointer;
  color: #2d2d2d;
  position: absolute;
  top: 30px;
  left: 40px;
  z-index: 100;
  transition: color 0.3s;
  
}

.back-arrow:hover {
  color: #535151;
}


/* Selected bus details container */
.selected-bus {
    font-size: 14px; 
  
    
    /* padding: 24px;  */
    height: 95vh; 
    background: #d1d1d1;
    display: flex;
    flex-direction: column;
    margin:10px 0px 0px 40px;
    border-radius: 10px;
   

  }



 

.name{
  position: fixed;
 top:15px;
  color: #080808;
}

  /* Individual bus card styling */
  .bus-card {

  padding: 25px; 
  color: #565448;
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 95vh; 
  margin: 40px 0px 0px 0px;
  
  
}


  

 
  .bus-card .value {
    margin-top: 12px;
    padding: 12px;
    color: #565448; /* Neutral color for readability */
    font-weight: 500; /* Slightly bold for emphasis */
   
    background-color: #b6b6b6; /* Light background for contrast */
    border-radius: 8px;
  }
  .val{
    margin-top: 12px;
    padding: 12px;
    color: #565448; /* Neutral color for readability */
    font-weight: 500; /* Slightly bold for emphasis */
     /* Subtle border for detail */
    border-radius: 8px;
    background-color: #b6b6b6;
  }

/* Button styles */
.selected-bus button {
  padding: 10px 15px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #ff6b6b, #ff4d4d); /* Vibrant gradient */
  border:none;
  border-radius: 15px; 
  cursor: pointer;
  display:flex;
  align-items: flex-end;
 

}

.selected-bus button:hover {
  background: linear-gradient(135deg, #ff4d4d, #ff3333); /* Darker hover gradient */
  
 
}


.middle-section {
  display: flex; 
  flex-direction: column;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  height: 93vh; 
  width: 20vw; 
  background-color: #d1d1d1;
  margin: 20px 20px 0px 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: transform 0.3s, box-shadow 0.3s; /* Smooth transitions */
}

.middle-section:hover {
 
  box-shadow: 0 8px 16px rgba(147, 145, 145, 0.2); /* Enhanced shadow on hover */
}

/* Status list */
.status-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  margin : 0px 40px 140px 0px
  
 

 
}

.status-item {
  font-size: 14px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 12px;
  color: #565448;
  transition: transform 0.3s, background-color 0.3s ease-in-out;
 
}

.status-item.high {
  background: linear-gradient(145deg, #ff4d4d, #ff6666);
}

.status-item.medium {
  background: linear-gradient(145deg, #ffa500, #ffb733);
}

.status-item.low {
  background: linear-gradient(145deg, #90ee90, #a8f5a8);
}

.status-item.accident {
  background: linear-gradient(145deg, #ff6347, #ff7b6b);
}

.status-item:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

.between {
  margin-left: auto;
  font-weight: bold;
}


</style>
