<template>
  <div class="ui-container">
    <!-- Sidebar -->
    <topbar />
    <floaingbar />
    <div class="sidebar">
      <!-- Route ID Search Section -->
      <div class="input-section">
        <div class="input-group">
          <input
            type="text"
            v-model="routeId"
            placeholder="Enter Route ID"
          />
          <button class="primary-btn" @click="fetchRouteStops">Search Route</button>
        </div>
      </div>
      
      <!-- Input Section for Start and End -->
      <div class="input-section">
        <div class="input-group">
          <input type="text" id="start" v-model="start" placeholder="Enter Starting Location" />
          <input type="text" id="end" v-model="end" placeholder="Enter Destination" />
        </div>
      </div>

      <!-- Controls Section -->
      <div class="controls-section">
        <button class="primary-btn" @click="calculateRoutes">Calculate Routes</button>
        <button class="control-btn" @click="resetMap">Reset Map</button>
      </div>

      <!-- Route List Section -->
      <div class="routes-section">
        <h2>Available Routes</h2>
        <div id="routeList" class="route-list"></div>
      </div>
    </div>

    <!-- Map Section -->
    <div class="map-container">
      <div id="map" ref="map"></div>
    </div>
  </div>
</template>


<script>
import floaingbar from "@/components/floaingbar.vue";
import topbar from "@/components/topbar.vue";
import busStop from "@/assets/bus-station.png"

export default {
  components: {
    topbar,
    floaingbar,
  },
  data() {
    return {
      routeId: "", // Holds the input route_id
      start: '',
      end: '',
      map: null,
      directionsService: null,
      directionsRenderer: null,
      trafficLayer: null,
      autocompleteStart: null,
      autocompleteEnd: null,
      markers: [],
      polylines: [],
      busMarkers: [],
      geocoder: null,
      mapType: 'roadmap',
      stops: [], // Holds fetched stops data
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: 28.6139, lng: 77.209 }, // Default to Delhi
        zoom: 12,
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

      this.trafficLayer = new google.maps.TrafficLayer();
      this.geocoder = new google.maps.Geocoder();
    },

    async fetchRouteStops() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/stops?route_id=${this.routeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stops');
        }
        const data = await response.json();
        this.stops = data;
        
        // Display the stops on the map
        this.displayStopsOnMap(this.stops);
      } catch (error) {
        console.error('Error fetching route stops:', error);
      }
    },

    displayStopsOnMap(stops) {
  // Clear existing markers and polylines
  this.clearMap();

  const routePath = [];

  // Add markers for each stop and prepare polyline path
  stops.forEach((stop) => {
    const position = {
      lat: parseFloat(stop.stop_lat),
      lng: parseFloat(stop.stop_lon),
    };
    routePath.push(position);

    // Add a marker for each stop with reduced size
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title: stop.stop_name,
      icon: {
        url: busStop,
        scaledSize: new google.maps.Size(30, 30), // Adjust size as needed
      },
    });
    this.busMarkers.push(marker);
  });

  // Draw polyline to connect stops
  const polyline = new google.maps.Polyline({
    path: routePath,
    strokeColor: "#007bff",
    strokeOpacity: 0.8,
    strokeWeight: 4,
  });
  polyline.setMap(this.map);
  this.polylines.push(polyline);

  // Adjust map bounds
  const bounds = new google.maps.LatLngBounds();
  routePath.forEach((point) => bounds.extend(point));
  this.map.fitBounds(bounds);
},


    clearMap() {
      // Clear markers
      this.busMarkers.forEach((marker) => marker.setMap(null));
      this.busMarkers = [];

      // Clear polylines
      this.polylines.forEach((polyline) => polyline.setMap(null));
      this.polylines = [];
    },

    calculateRoutes() {
      this.clearRouteData();
      if (!this.start || !this.end) {
        alert('Please enter both start and end locations');
        return;
      }

      const request = {
        origin: this.start,
        destination: this.end,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: 'bestguess',
        }
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.displayRoutes(result);
        } else {
          alert('Failed to get routes: ' + status);
        }
      });
    },

    displayRoutes(result) {
      const routes = result.routes;
      const routeList = document.getElementById('routeList');
      routeList.innerHTML = ''; 

      // Clear previous markers and polylines
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      this.polylines.forEach(polyline => polyline.setMap(null));
      this.polylines = [];

      // Set start and end markers
      const startLocation = result.routes[0].legs[0].start_location;
      const endLocation = result.routes[0].legs[0].end_location;

      this.markers.push(new google.maps.Marker({
        position: startLocation,
        map: this.map,
        title: 'Start',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      }));

      this.markers.push(new google.maps.Marker({
        position: endLocation,
        map: this.map,
        title: 'End',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      }));

      routes.forEach((route, index) => {
        const routeInfo = document.createElement('div');
        const routeDistance = route.legs[0].distance.text;
        const routeDuration = route.legs[0].duration.text;

        routeInfo.innerHTML = `
          <h3>Route ${index + 1}</h3>
          <p>Distance: ${routeDistance}</p>
          <p>Duration: ${routeDuration}</p>
        `;

        routeInfo.addEventListener('click', () => {
          this.showRoute(index);
        });

        routeList.appendChild(routeInfo);

        const polyline = new google.maps.Polyline({
          path: route.overview_path,
          strokeColor: this.getRouteColor(index),
          strokeOpacity: 0.7,
          strokeWeight: 5
        });
        polyline.setMap(this.map);
        this.polylines.push(polyline);
      });

      const bounds = new google.maps.LatLngBounds();
      routes.forEach(route => {
        route.overview_path.forEach(point => {
          bounds.extend(point);
        });
      });
      this.map.fitBounds(bounds);
    },

    showRoute(routeIndex) {
      this.polylines.forEach(polyline => polyline.setMap(null));
      this.polylines[routeIndex].setMap(this.map);
    },

    resetMap() {
      window.location.reload();
      this.map.setCenter({ lat: 28.6139, lng: 77.209 });
      this.map.setZoom(12);
    },

    clearRouteData() {
      // Clear existing markers
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];

      // Clear existing polylines
      this.polylines.forEach(polyline => polyline.setMap(null));
      this.polylines = [];

      // Clear directions from DirectionsRenderer
      if (this.directionsRenderer) {
        this.directionsRenderer.setDirections({ routes: [] });
      }
    },

    getRouteColor(index) {
      switch (index) {
        case 0: return '#28a745'; // Green for optimal route
        case 1: return '#ffc107'; // Yellow for medium traffic
        case 2: return '#dc3545'; // Red for high traffic
        default: return '#007bff'; // Blue for other routes
      }
    },
  }
};
</script>


<style scoped>
.ui-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #e1e2e7; /* Dark background for the whole container */
}
/* .back-arrow{
  position: absolute;
} */
/* Sidebar Styling */
.sidebar {
  width: 22%;
  background-color: #fff; /* Darker sidebar background */
  color: #e0e0e0; /* Lighter text for contrast */
  padding: 20px;
  margin-left: 60px;
  margin-top:80px;
  height: 85%;
  border-radius: 20px;
}

.input-section,
.controls-section,
.routes-section {
  margin-bottom: 20px;
  
  
}
.input-group {
  position: relative;
}
.sidebar .back-arrow {
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 20px;
}
.input-group{
  margin-top:20px;
}
.input-group input {
  width: 100%;
  margin-bottom: 10px;
  padding: 15px;
  border: none;
  border-radius: 9px;
  background-color: #e9e9e9; /* Darker input background */
  color: #575757; /* White text */
}
.controls-section{
  display: flex;
  justify-content: space-around;
  gap: 5px;
}
.primary-btn {
  width: 100%;
  padding: 20px;
  margin-bottom: 10px;
  border: none;
  background-color: #b2b6ce; /* Vibrant button color */
  color: white;
  border-radius: 5px;
  cursor: pointer;
  
}
.control-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f40313; /* Blue button color */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
 
}
.primary-btn:hover{
  background-color: #ced6e4;
}
.control-btn:hover {
  background-color: #ef6060; /* Darker hover effect */
}

/* Map Styling */
.map-container {
  flex: 1;
  background-color: #e1e2e7; /* Match the sidebar background for cohesion */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top:70px;
}

.map-container #map {
  width: 95%;
  height: 95%;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* Stronger shadow for depth */
}
.routes-section {
  background-color: #e2e7fa; /* Slightly darker background */
  padding: 15px;
  color: 555555;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Add some depth */
}

.routes-section h2 {
  color: #555555; /* Vibrant color for the title */
  margin-bottom: 10px;
  text-align: center;
}

.route-list {
  max-height: 300px; /* Limit height for scrollability */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 10px;
  color: #555555;
}

.route-list div {
  background-color: #fbfbfb; /* Dark card-like background */
  color: #555555; /* Light text for contrast */
  padding: 10px;
  margin-bottom: 20px; /* Add space between routes */
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.route-list div:last-child {
  margin-bottom: 0; /* No space after the last route */
}


.route-list div:hover {
  background-color: #ff5722; /* Highlight color on hover */
  color: #ffffff; /* Ensure text remains visible */
  transform: scale(1.05); /* Slight zoom effect */
}

.route-list h3 {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: bold;
}

.route-list p {
  margin: 0;
  font-size: 14px;
}



</style>