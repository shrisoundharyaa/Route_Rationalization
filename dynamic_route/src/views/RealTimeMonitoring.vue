<template>
  <div class="container">
    <sidenav />
    <div  id="map" ref="map"></div>
    <!-- <div id="controls">
      <button @click="resetMap">Reset Map</button>
      <select v-model="mapType" @change="changeMapType">
        <option value="roadmap">Roadmap</option>
        <option value="satellite">Satellite</option>
        <option value="hybrid">Hybrid</option>
        <option value="terrain">Terrain</option>
      </select>
      <button @click="toggleTrafficLayer">Toggle Traffic Layer</button>
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
    </div> -->
    <div id="routeList"></div>
  </div>
</template>

<script>
import sidenav from '../components/sidenav.vue';
export default {
  components: { sidenav },
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
        ],
        mapTypeControl: true, // Enable map type control
        mapTypeControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP, // Position on the right top
      },
      });
      
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

      this.trafficLayer = new google.maps.TrafficLayer();
      this.trafficLayer.setMap(this.map);

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
    changeMapType() {
      this.map.setMapTypeId(this.mapType);
    },
  }
};
</script>

<style scoped>
#map {
  position: absolute; 
  top: 0;
  left: 0;
  height: 100vh; 
  width: 100vw; 
}

#controls {
  margin-top: 10px;
}

input {
  margin: 10px;
  padding: 5px;
}

button {
  padding: 10px;
  margin: 5px;
  cursor: pointer;
}

select {
  margin: 10px;
}

.container {
  text-align: center;
}
</style>