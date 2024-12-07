<template>
  <div class = "main-container">
  <div class="grid-container">
   
    <!-- Left Container -->
     <div class="left-container">
      <div class="content">
        <topbar />
        <floaingbar />
        <div v-if="selectedBus" class="detail-container">
          <h3>Bus Details</h3>
          <p><strong>Driver:</strong> {{ selectedBus.details.driverName }}</p>
          <p><strong>Bus ID:</strong> {{ selectedBus.details.busId }}</p>
          <p><strong>Route ID:</strong> {{ selectedBus.details.routeId }}</p>
        </div>
        <div v-else>
          <p>No bus selected</p>
        </div>
        <div v-if="selectedBus" class="detail-container">
          <h3>Route Details</h3>
          <p><strong>Source:</strong> {{ selectedBus.details.source }}</p>
          <p><strong>Destination:</strong> {{ selectedBus.details.destination }}</p>
          <p><strong>Delay:</strong> {{ selectedBus.details.delayTime }} mins</p>
        </div>
        <div v-else>
          <p>No bus selected</p>
        </div>

        <!-- Stats Card -->
        
      </div>
    </div>

    <!-- Center Container (Map) -->
    <div class="center-container">
      <div class="card map-container">
        <div id="map" ref="map"></div>
      </div>
    </div>

    <!-- Right Container -->
    <div class="right-container">
      <div class="content">
        

        <!-- Stats Card for Top Buses -->
        <div class="stats-card">
          <h4>Total Buses Running</h4>
          <p>{{ buses.length }}</p>
          <!-- <div class="graph"></div> -->
        </div>
        <div class="stats-card">
          <h4>Top Buses</h4>
          <!-- <p>Bus 1, Bus 3, Bus 5</p> -->
          <canvas id="topBusesChart" width="250" height="150"></canvas>
          <!-- <div class="graph"></div>  -->
        </div>
        <div class="stats-card">
          <h4 style=" font-size: 1.3rem;">Average Delay</h4>


       <canvas id="averageDelayChart" width="25" height="150"></canvas>
</div>
        
      </div>
    </div>
  </div>
</div>
</template>





<script>
// import sidenav from '../components/sidenav.vue';
import busIcon from '@/assets/bus.png';
import floaingbar from "@/components/floaingbar.vue";
import topbar from "@/components/topbar.vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
export default {
  components: {  topbar,
    floaingbar, },
  data() {
    return {
      map: null,
      trafficLayer: null,
      buses: [],
      directionsService: null,
      routes: [],
      selectedBus: null,
      geocoder: null, 
      buses: [
        { delay: 10 },
        { delay: 5 },
        { delay: 15 },
      ],
    };
  },
  mounted() {
    this.initMap();
    const lastSelectedBus = localStorage.getItem("lastSelectedBus");
      if (lastSelectedBus) {
        this.selectedBus = JSON.parse(lastSelectedBus);
      }
   
      this.initAverageDelayChart();
      this.initTopBusesChart();
    
  },
  methods: {
    async initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: 28.6139, lng: 77.209 }, // Center the map on Delhi
        zoom: 12,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
          { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e3f2fd' }] },
        ],
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
      });

      this.trafficLayer = new google.maps.TrafficLayer();
      this.trafficLayer.setMap(this.map);

      this.directionsService = new google.maps.DirectionsService();
      this.geocoder = new google.maps.Geocoder(); // Initialize the geocoder

      await this.loadRoutes();

      this.routes.forEach((route, index) => this.initBus(route, index)); 
      this.map.addListener('zoom_changed', () => {
        const zoomLevel = this.map.getZoom();
        this.updateBusMarkerSizes(zoomLevel);
      });
    },
    calculateAverageDelay() {
    if (this.buses.length === 0) return 0;
    const totalDelay = this.buses.reduce((sum, bus) => sum + bus.delay, 0);
    return (totalDelay / this.buses.length).toFixed(2); // Rounded to 2 decimal places
  },
  initAverageDelayChart() {
    const ctx = document.getElementById("averageDelayChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: this.buses.map((_, index) => `Bus ${index + 1}`), // Label each bus
        datasets: [
          {
            label: "Delay (mins)",
            data: this.buses.map((bus) => bus.delay), // Pass the delay times
            backgroundColor: ["#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0"], // Colors
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });
  },
    calculateAverageDelay() {
      if (this.buses.length === 0) return 0;
      const totalDelay = this.buses.reduce((sum, bus) => sum + bus.delay, 0);
      return (totalDelay / this.buses.length).toFixed(2); // Rounded to 2 decimal places
    },
    initTopBusesChart() {
      const ctx = document.getElementById("topBusesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar", // Bar chart type
        data: {
          labels: ["Bus 1", "Bus 3", "Bus 5"], // Example bus names
          datasets: [
            {
              label: "Delay (mins)",
              data: [10, 5, 15], // Example delay times
              backgroundColor: ["#4caf50", "#2196f3", "#f44336"], // Colors
              borderColor: ["#388e3c", "#1976d2", "#d32f2f"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    async loadRoutes() {
      try {
        const response = await fetch('/buses.json');
        if (!response.ok) {
          throw new Error('Failed to load routes');
        }
        this.routes = await response.json();
      } catch (error) {
        console.error('Error loading routes:', error);
      }
    },
    async initBus(route, index) {
      const busIconOptions = this.getBusIconSize(this.map.getZoom());

      const busMarker = new google.maps.Marker({
        position: route.start,
        map: this.map,
        icon: busIconOptions,
        title: `Bus ${index + 1}`,
      });
      
      busMarker.addListener('click', () => {
        this.geocodeCoordinates(route.start, route.end, index);
      });

      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: this.getRandomColor(),
          strokeWeight: 4,
        },
      });

      this.buses.push({
        marker: busMarker,
        directionsRenderer,
        currentStep: 0,
        route: [],
        animationInterval: null,
      });

      this.calculateRoute(route, index);
    },
    calculateRoute(route, index) {
      const request = {
        origin: route.start,
        destination: route.end,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const routePath = result.routes[0].overview_path;
          this.buses[index].route = routePath;

          this.buses[index].directionsRenderer.setDirections(result);

          this.startBusAnimation(this.buses[index]);
        } else {
          console.error('Directions request failed for bus ' + (index + 1) + ': ' + status);
        }
      });
    },
    getBusIconSize(zoomLevel) {

      const baseSize = 20;

      const scaleFactor = 1 + (zoomLevel - 15) * 0.1;  // Adjust the factor as needed
      const iconSize = baseSize * scaleFactor;

      return {
        url: busIcon,
        size: new google.maps.Size(iconSize, iconSize),
        scaledSize: new google.maps.Size(iconSize, iconSize),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
      };
    },
    updateBusMarkerSizes(zoomLevel) {
      this.buses.forEach(bus => {
        const newIcon = this.getBusIconSize(zoomLevel);
        bus.marker.setIcon(newIcon);  // Update the marker's icon with new size
      });
    },


    async geocodeCoordinates(start, end, index) {
      try {
        const startPlace = await this.reverseGeocode(start);
        const endPlace = await this.reverseGeocode(end);

        this.selectedBus = {
          details: {
            driverName: `Driver ${index + 1}`,
            source: startPlace,
            destination: endPlace,
            busId: `Bus-${index + 1}`,
            routeId: `Route-${index + 1}`,
            delayTime: Math.floor(Math.random() * 30) + 1,
          },
        };
        localStorage.setItem("lastSelectedBus", JSON.stringify(this.selectedBus));
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    },
    reverseGeocode(latLng) {
      return new Promise((resolve, reject) => {
        this.geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject('Geocode failed: ' + status);
          }
        });
      });
    },
    startBusAnimation(bus) {
      bus.currentStep = 0;
      bus.directionForward = true;

      bus.animationInterval = setInterval(() => {
        if (bus.directionForward) {
              if (bus.currentStep < bus.route.length - 1) {
                bus.currentStep++;
              } else {
                bus.directionForward = false;  
                bus.currentStep--;  
              }
            } else {
              if (bus.currentStep > 0) {
                bus.currentStep--;
              } else {
                bus.directionForward = true;  
                bus.currentStep++; 
              }
            }

        
            bus.marker.setPosition(bus.route[bus.currentStep]);
          }, 1000); 
    },
    closeOverlay() {
      this.selectedBus = null;
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>
<style scoped>
.main-container {
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
  height: 110vh; /* Full viewport height */
  /* overflow-y: auto;  */
  width: 100vw;
  /* overflow-x: hidden;
  box-sizing: border-box;
  -ms-overflow-style: none; */
}

/* ::-webkit-scrollbar {
  display: none;
} */
.grid-container {
  margin-left: 50px;
  margin-top: 80px;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 100vh;
  width: 100vw;
}

.left-container,
.right-container {
  background-color: #e0e1e3; /* --background-1 */
  display: flex;
  justify-content: flex-start;
  flex-direction: column; /* Stack the elements vertically */
  align-items: center;
  padding: 20px;
  overflow-y: auto; /* Add scrolling if content exceeds container height */
}

.left-container {
  padding-top: 40px; /* Add space at the top */
}

.right-container {
  padding-top: 20px;
  overflow-y: auto;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  /* gap: 20px; */
  color: #18181b;
  width: 100%;
  max-width: 400px; /* Limit content width */
}

h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: #fff;
}

p {
  font-size: 1rem;
  margin: 0;
}

.detail-container {
  background-color: #fff; /* Dark background for contrast */
  padding: 20px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
  max-width: 380px; /* Limit width */
  color: #353f80; /* Text color */
  margin-top: 20px;
}

.detail-container h3 {
  font-size: 1.6rem;
  margin-bottom: 10px;
  text-align: center;
  color: #353f80;
}

.detail-container p {
  font-size: 1rem;
  margin: 10px 0;
  color: #18181b; /* Light text color */
}

/* Optional: Style for the "No bus selected" message */
.detail-container p.no-selected {
  color: #f00; /* Red color for error message */
  text-align: center;
}

.center-container {
  background-color: #e0e1e3;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card {
  background-color: #ffffff; /* Card background */
  padding: 20px;
  border-radius: 100px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px; /* Shadow */
  color: #18181b; /* Main text color */
}

.map-container {
  width: 100%;
  height: 85%; /* Adjust as necessary */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
}

#map {
  width: 100%;
  height: 103%;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

/* Stats Cards */
.stats-card {
  background-color: #fff;
  padding: 20px;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
  max-width: 250px;
  /* margin-top: 2px; */
}

.stats-card h4 {
  margin: 0;
  font-size: 1.3rem;
  color: #353f80;
  text-align: center;
}

.stats-card p {
  font-size: 1rem;
  color: #18181b;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 100%; /* Full width for smaller screens */
    grid-template-rows: auto auto; /* Stack rows */
  }
}

.stats-card canvas {
  margin-top: 10px;
}
</style>

