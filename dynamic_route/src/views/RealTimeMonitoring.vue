<template>
  <div class="container">
    <sidenav />
    <div id="map" ref="map"></div>
    <div id="routeList"></div>
  </div>
</template>

<script>
import sidenav from '../components/sidenav.vue';
import busIcon from '@/assets/bus.png';

export default {
  components: { sidenav },
  data() {
    return {
      map: null,
      trafficLayer: null,
      buses: [], // Store each bus's data
      directionsService: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
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

      // Define routes for 3 buses
      const routes = [
        { start: { lat: 28.6139, lng: 77.209 }, end: { lat: 28.6190, lng: 77.220 } }, // Route 1
        { start: { lat: 28.6358, lng: 77.2245 }, end: { lat: 28.6467, lng: 77.2310 } }, // Route 2
        { start: { lat: 28.6055, lng: 77.2000 }, end: { lat: 28.5903, lng: 77.1804 } }, // Route 3
      ];

      // Initialize buses with unique routes
      routes.forEach((route, index) => this.initBus(route, index));
    },
    initBus(route, index) {
      const busIconOptions = {
        url: busIcon,
        size: new google.maps.Size(40, 40),
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 20),
      };

      const busMarker = new google.maps.Marker({
        position: route.start,
        map: this.map,
        icon: busIconOptions,
        title: `Bus ${index + 1}`,
      });

      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true, // Suppress default markers to avoid duplicate markers
        polylineOptions: {
          strokeColor: this.getRandomColor(), // Random color for each route
          strokeWeight: 4,
        },
      });

      // Add bus details to the buses array
      this.buses.push({
        marker: busMarker,
        directionsRenderer,
        currentStep: 0,
        route: [], // Store route path for animation
        animationInterval: null,
      });

      // Fetch and display the route
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
          this.buses[index].route = routePath; // Store route path for animation

          // Display the route using DirectionsRenderer
          this.buses[index].directionsRenderer.setDirections(result);

          // Start bus animation along the route
          this.startBusAnimation(this.buses[index]);
        } else {
          console.error('Directions request failed for bus ' + (index + 1) + ': ' + status);
        }
      });
    },
    startBusAnimation(bus) {
      bus.currentStep = 0;

      bus.animationInterval = setInterval(() => {
        if (bus.currentStep < bus.route.length - 1) {
          bus.currentStep++;
          bus.marker.setPosition(bus.route[bus.currentStep]); // Move the bus marker
        } else {
          clearInterval(bus.animationInterval); // Stop animation when route ends
        }
      }, 1000); // Update position every second
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
#map {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}
.container {
  text-align: center;
}
</style>
