<template>
  <div class="ui-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Input Section -->
      <div class="input-section">
        <div class="input-group">
          <input type="text" id="start" v-model="start" placeholder="Enter Starting Location" />
          <input type="text" id="end" v-model="end" placeholder="Enter Destination" />
          <button class="primary-btn" @click="calculateRoutes">Calculate Routes</button>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="controls-section">
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
export default {
  data() {
    return {
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
    };
  },
  mounted() {
    // Initialize Google Maps
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        center: { lat: 28.6139, lng: 77.209 },
        zoom: 12,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
          { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e3f2fd' }] },
        ]
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

      this.trafficLayer = new google.maps.TrafficLayer();

      this.autocompleteStart = new google.maps.places.Autocomplete(document.getElementById('start'));
      this.autocompleteEnd = new google.maps.places.Autocomplete(document.getElementById('end'));

      this.geocoder = new google.maps.Geocoder();

      this.addBusMarkers(this.busMarkers);
    },
    addBusMarkers(locations) {
      locations.forEach(location => {
        const marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: 'Bus Stop',
          icon: 'http://maps.google.com/mapfiles/ms/icons/bus.png',
        });
        this.busMarkers.push(marker);
      });
    },
    calculateRoutes() {
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
      this.start = '';
      this.end = '';
      document.getElementById('routeList').innerHTML = '';
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      this.polylines.forEach(polyline => polyline.setMap(null));
      this.polylines = [];
      this.busMarkers.forEach(marker => marker.setMap(null));
      this.busMarkers = [];
      this.map.setCenter({ lat: 22.5744, lng: 88.3629 });
      this.map.setZoom(12);
    },
    toggleTrafficLayer() {
      if (this.trafficLayer.getMap()) {
        this.trafficLayer.setMap(null);
      } else {
        this.trafficLayer.setMap(this.map);
      }
    },
    zoomIn() {
      this.map.setZoom(this.map.getZoom() + 1);
    },
    zoomOut() {
      this.map.setZoom(this.map.getZoom() - 1);
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
}

/* Sidebar Styling */
.sidebar {
  width: 25%;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  /* display: flex;
  flex-direction: column;
  gap: 20px; */
}

.input-section,
.controls-section,
.routes-section {
  margin-bottom: 20px;
}

.input-group input {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #34495e;
  color: #ecf0f1;
}

.input-group button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #e74c3c;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.input-group button:hover {
  background-color: #c0392b;
}

.control-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.control-btn:hover {
  background-color: #2980b9;
}

/* Map Styling */
.map-container {
  flex: 1;
  background-color: #34495e;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-container #map {
  width: 95%;
  height: 95%;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
