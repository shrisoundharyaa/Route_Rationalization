<template>
  <div class="main-container">
    <aside class="sidebar">
        <nav>
          <ul>
            DashBoard
            <li @click="$router.push('/real')">
          <i class="fas fa-route"></i> Map
        </li>   
            <li @click="$router.push('/buses')">
                <i class="fas fa-bus"></i> Buses
            </li>
            <li @click="$router.push('/routes')">
          <i class="fas fa-route"></i> Routes
        </li>
          <li @click="$router.push('/depot')">
            <i class="fas fa-warehouse"></i> Depot
          </li>
       
          </ul>
        </nav>
      </aside>
    <div class="left-container"></div>
    <div class="right-container">
      <div class="map-container">
        
          <div id="top-left" ref="topLeftMap" class="map"></div>
          <div id="top-right" ref="topRightMap" class="map"></div>

        
          <div id="bottom-left" ref="bottomLeftMap" class="map"></div>
          <div id="bottom-right" ref="bottomRightMap" class="map"></div>
        
      </div>
      <div id="routeList"></div>
    </div>
  </div>
</template>

<script>
import sidenav from '../components/sidenav.vue';

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
    this.initMaps(); 
  },
  methods: {
    async initMaps() {
      // Map initialization options
      const mapOptions = {
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
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl:false,
        
      };

      this.topLeftMap = this.initMap(this.$refs.topLeftMap, mapOptions);
      this.topRightMap = this.initMap(this.$refs.topRightMap, mapOptions);
      this.bottomLeftMap = this.initMap(this.$refs.bottomLeftMap, mapOptions);
      this.bottomRightMap = this.initMap(this.$refs.bottomRightMap, mapOptions);

      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(this.topLeftMap)

      const heatmapData = [
          new google.maps.LatLng(28.6139, 77.209),
          new google.maps.LatLng(28.7041, 77.1025),
          new google.maps.LatLng(28.5355, 77.3910),
        ];


          const heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            
          });
          heatmap.setMap(this.topRightMap);
          
    },
    
    initMap(mapElement, options) {
      return new google.maps.Map(mapElement, options);
    },
    // Other methods remain the same as your original code...
  },
};
</script>

<style scoped>
.main-container {
  display: flex; 
  height: 100vh; 
  width: 100vw; 
}

.left-container {

  width: 700px;
  background-color: #222222; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
}
.sidebar {
    width: 250px;
    background-color: black;
    color: white;
    padding: 20px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin: 15px 0;
  }
  
  .sidebar ul li a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  
  .sidebar ul li a:hover {
    color: #1e90ff;
  }
.right-container {
  width: 75%; /* Takes up the other half of the page */
  background-color: #383737; /* Light contrast to the left side */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

.map-container {
  display: grid;
  grid-template-rows: repeat(2, 1fr); /* Two rows with equal height */
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  height: 100%;
  width: 100%;
  gap: 10px;
}



.map {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

#top-left,
#top-right,
#bottom-left,
#bottom-right {
  height: 100%;
}
</style>
