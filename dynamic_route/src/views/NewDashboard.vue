<template>
    <div class="dashboard">
      <!-- Header Section -->
      <header class="header">
        <!-- <h1>Real-Time Traffic Information Dashboard</h1> -->
      </header>
  
      <!-- Main Grid Layout -->
      <div class="grid-container">
        <!-- Left Information Card -->
        <div class="card card-info">
          <p><strong>5,067</strong> <span class="icon">🚍</span></p>
          <p><strong>2,066</strong> <span class="icon">🚖</span></p>
          <p><strong>Last Updated Time:</strong><br>Taxi: 29/12/2021, 14:44:37</p>
          <p><strong>Estimated Travel Time:</strong><br>29/12/2021, 14:44:25</p>
        </div>
  
        <!-- Map Section -->
        <div class="card map-area">
          <div id="map" ref="map"></div>
        </div>
  
        <!-- Right Traffic Incidents Section -->
        <div class="card card-incidents">
          <h3>Traffic Incidents</h3>
          <ul>
            <li><strong>Accident:</strong> 29/12/2021, 17:03 at Upper Serangoon Rd</li>
            <li><strong>Heavy Traffic:</strong> CTE (towards SLE)</li>
            <li><strong>Roadwork:</strong> Marine Parade Rd</li>
          </ul>
        </div>
  
        <!-- Bottom Graphs -->
        <div class="card card-graph">
          <h3>Weekday Passenger Volume</h3>
          <canvas id="weekdayChart" width="400" height="250"></canvas>
        </div>
        <div class="card card-graph">
          <h3>Weekend/Holiday Passenger Volume</h3>
          <canvas id="weekendChart" width="400" height="250"></canvas>
        </div>
      </div>
  
      <!-- Additional Grid Container -->
      <div class="grid-container extra-grid-container">
        <!-- Additional Information Card -->
        <div class="card card-extra-info">
          <h3>Average Speed</h3>
          <p><strong>City:</strong> 45 km/h</p>
          <p><strong>Highway:</strong> 80 km/h</p>
        </div>
  
        <!-- Additional Graph -->
        <div class="card card-extra-graph">
          <h3>Monthly Traffic Trends</h3>
          <canvas id="monthlyTrafficChart" width="400" height="250"></canvas>
        </div>
  
        <!-- Additional Notification Section -->
        <div class="card card-extra-notifications">
          <h3>Notifications</h3>
          <ul>
            <li><strong>Scheduled Maintenance:</strong> 30/12/2021, 10:00</li>
            <li><strong>Weather Alert:</strong> Heavy rain expected tomorrow.</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import { Chart, registerables } from "chart.js";
  Chart.register(...registerables);
  
  export default {
    name: "TrafficDashboard",
    data() {
      return {
        map: null,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.initMap();
        this.renderWeekdayChart();
        this.renderWeekendChart();
      });
    },
    methods: {
      initMap() {
        this.map = new google.maps.Map(this.$refs.map, {
          center: { lat: 28.6139, lng: 77.209 },
          zoom: 12,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#e3f2fd" }] },
          ],
        });
      },
      renderWeekdayChart() {
        this.$nextTick(() => {
          const ctx = document.getElementById("weekdayChart").getContext("2d");
          new Chart(ctx, {
            type: "line",
            data: {
              labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              datasets: [
                {
                  label: "Passengers",
                  data: [1200, 1500, 1700, 1600, 2000],
                  borderColor: "#42a5f5",
                  fill: true,
                  backgroundColor: "rgba(66, 165, 245, 0.2)",
                },
              ],
            },
          });
        });
      },
      renderWeekendChart() {
        this.$nextTick(() => {
          const ctx = document.getElementById("weekendChart").getContext("2d");
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: ["Saturday", "Sunday", "Holiday"],
              datasets: [
                {
                  label: "Passengers",
                  data: [1800, 2200, 2500],
                  backgroundColor: ["#ef5350", "#ffca28", "#66bb6a"],
                },
              ],
            },
          });
        });
      },
    },
  };
  </script>
  
  <style scoped>
/* General Layout */
body {
  font-family: Arial, sans-serif;
  
}

.dashboard {
  background-color: #2c2c2c;
  color: white;
  padding: 20px;
  width: 100vw;
  height: 100vh;
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Disable horizontal scrolling */
  box-sizing: border-box; /* Ensure padding doesn't exceed the width/height */
  -ms-overflow-style: none;
}
::-webkit-scrollbar {
  display: none; /* For Webkit browsers (Chrome, Safari, etc.) */
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 10px;
}

.card {
  background-color: #333;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-info p,
.card-incidents ul {
  margin: 10px 0;
}

.card-incidents ul {
  list-style: none;
  padding: 0;
}

.card-incidents li {
  margin-bottom: 8px;
}

/* Map Section */
.map-area {
  grid-column: 2 / span 1;
  grid-row: 1 / span 2;
}

#map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/* Graphs */
.card-graph {
  grid-column: span 1;
}

canvas {
  display: block;
  max-width: 100%;
  height: 250px;
}

/* Extra Grid Container */
.extra-grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three equal columns */
  gap: 20px; /* Space between cards */
  margin-top: 20px; /* Spacing from the previous container */
}

.card-extra-info,
.card-extra-graph,
.card-extra-notifications {
  background-color: #444; /* Slightly lighter gray for distinction */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Subtle shadow */
}

.card-extra-info {
  color: #4caf50; /* Green for information highlights */
  font-size: 16px;
}

.card-extra-graph h3 {
  color: #2196f3; /* Blue for graph titles */
  margin-bottom: 10px;
}

.card-extra-notifications h3 {
  color: #ff9800; /* Orange for notifications */
}

.card-extra-notifications ul {
  list-style: disc; /* Bullet points */
  margin-left: 20px;
  color: #ddd; /* Light gray for list text */
}

/* Responsive Design */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .map-area {
    grid-column: span 1;
    grid-row: auto;
  }

  .extra-grid-container {
    grid-template-columns: 1fr; /* Single-column layout for smaller screens */
  }
}
</style>
