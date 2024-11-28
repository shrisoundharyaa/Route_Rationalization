<template>
  <div class="main-container">
    <div class="left-container">
      <sidenav :selected-bus="selectedBus" @closeOverlay="selectedBus = null" />
     
    </div>
    
    <div class="right-container">
      <div class="map-container">
        <div id="map" ref="map"></div>
      </div>
      <div id="routeList"></div>
    </div>
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
      buses: [],
      directionsService: null,
      routes: [],
      selectedBus: null,
      geocoder: null, 
    };
  },
  mounted() {
    this.initMap();
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
  display: flex; /* Align children horizontally */
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
}

.left-container {
  width: 25%; 
  background-color: #222222; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
}

.right-container {
  width: 100%; /* Takes up the other half of the page */
  background-color: #383737; /* Light contrast to the left side */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.map-container {
  width: 100%; /* Full width within the right container */
  height: 100%; /* Adjust height as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 2px solid #0b0b0b; */
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
}

#map {
  width: 100%; /* Slight padding within the container */
  height: 100%; /* Full height */
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

button {
  background-color: #2196f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1976d2;
}
</style>
