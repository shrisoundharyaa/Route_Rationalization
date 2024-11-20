<template>
    <div class="main">
        <div class="back-arrow" @click="$router.push('/')">
          <i class="fa fa-arrow-left"></i>
        </div>
      <h1>Dynamic-Route-Rationalization-Model</h1>
      <div class="input-container">
        <input
          type="text"
          v-model="source"
          placeholder="Enter starting location"
        />
        <input
          type="text"
          v-model="destination"
          placeholder="Enter destination"
        />
        <button @click="calculateRoutes">Calculate Routes</button>
      </div>
      <div class="map" id="map"></div>
      <div id="controls">
        <button @click="resetMap">Reset Map</button>
        <select v-model="mapType" @change="changeMapType">
          <option value="roadmap">Roadmap</option>
          <option value="satellite">Satellite</option>
          <option value="hybrid">Hybrid</option>
          <option value="terrain">Terrain</option>
        </select>
      </div>
      <div id="routeList"></div>
    </div>
    
  </template>
  
  <script>
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import axios from "axios";
  
  export default {
    name: "RouteManagement",
    data() {
      return {
        map: null,
        source: "",
        destination: "",
        mapType: "roadmap",
        markers: [],
        routeLayer: null,
      };
    },
    methods: {
      initMap() {
        // Initialize the map
        this.map = L.map("map", { zoomControl: false }).setView(
          [28.6139, 77.209],
          13
        );
  
        // Add zoom control
        L.control
          .zoom({
            position: "topright",
          })
          .addTo(this.map);
  
        // Add tile layer
        L.tileLayer(
          "https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=pk.9f88024f3c74bfd657fb88d60557dc6d",
          {
            attribution: "© LocationIQ contributors",
            maxZoom: 18,
          }
        ).addTo(this.map);
      },
      async calculateRoutes() {
  if (!this.source || !this.destination) {
    alert("Please enter both source and destination!");
    return;
  }

  try {
    // Geocode source and destination
    const geocodeBaseUrl = "https://us1.locationiq.com/v1/search.php";
    const sourceResponse = await axios.get(geocodeBaseUrl, {
      params: { q: this.source, format: "json", key: "pk.9f88024f3c74bfd657fb88d60557dc6d" },
    });
    const destinationResponse = await axios.get(geocodeBaseUrl, {
      params: { q: this.destination, format: "json", key: "pk.9f88024f3c74bfd657fb88d60557dc6d" },
    });

    // Log the geocoding results for debugging
    console.log('Source Response:', sourceResponse.data);
    console.log('Destination Response:', destinationResponse.data);

    const sourceCoords = [
      parseFloat(sourceResponse.data[0].lat),
      parseFloat(sourceResponse.data[0].lon),
    ];
    const destinationCoords = [
      parseFloat(destinationResponse.data[0].lat),
      parseFloat(destinationResponse.data[0].lon),
    ];

    // Add markers for source and destination
    this.addMarker(sourceCoords, "Source");
    this.addMarker(destinationCoords, "Destination");

    // Directions API call
    const coordinates = `${sourceCoords[1]},${sourceCoords[0]};${destinationCoords[1]},${destinationCoords[0]}`;
    console.log('Coordinates:', coordinates);  // Log coordinates
    const directionsUrl = `https://us1.locationiq.com/v1/directions/driving/${coordinates}?key=pk.9f88024f3c74bfd657fb88d60557dc6d&overview=full&geometries=geojson`;
    const routeResponse = await axios.get(directionsUrl);

    // Log the route response
    console.log('Route Response:', routeResponse.data);

    // Extract route coordinates and draw polyline
    const routeCoordinates = routeResponse.data.routes[0].geometry.coordinates.map(
      (coord) => [coord[1], coord[0]]
    );
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }
    this.routeLayer = L.polyline(routeCoordinates, {
      color: "blue",
      weight: 4,
    }).addTo(this.map);

    // Fit the map view to the route
    this.map.fitBounds(this.routeLayer.getBounds());
  } catch (error) {
    console.error("Error fetching route:", error);
    alert("Unable to fetch route. Please check your inputs or API key.");
  }
},


      addMarker(coords, label) {
        const marker = L.marker(coords).addTo(this.map).bindPopup(label);
        this.markers.push(marker);
      },
      resetMap() {
        this.map.setView([28.6139, 77.209], 13);
  
        // Remove all markers and routes
        this.markers.forEach((marker) => this.map.removeLayer(marker));
        this.markers = [];
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
          this.routeLayer = null;
        }
      },
      changeMapType() {
        const tileLayerUrls = {
          roadmap:
            "https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=pk.9f88024f3c74bfd657fb88d60557dc6d",
          satellite:
            "https://{s}-tiles.locationiq.com/v3/satellite/r/{z}/{x}/{y}.png?key=pk.9f88024f3c74bfd657fb88d60557dc6d",
        };
        L.tileLayer(tileLayerUrls[this.mapType], {
          attribution: "© LocationIQ contributors",
          maxZoom: 18,
        }).addTo(this.map);
      },
    },
    mounted() {
      this.initMap();
    },
  };
  </script>
  
 
<style scoped>
/* Overall Page Styling */
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(to right, #2c3e50, #3498db);
  color: #fff;
  font-family: 'Arial', sans-serif;
  text-align: center;
}

.back-arrow {
  font-size: 24px;
  color: white;
  cursor: pointer;
  top:0;
  left:0;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #f1c40f;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

/* Input Container Styling */
.input-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.input-container input {
  width: 300px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.input-container input:focus {
  outline: none;
  border: 2px solid #3498db;
}

/* Button Styling */
button {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: #c0392b;
}

button:active {
  transform: scale(0.98);
}

/* Map Controls */
#controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

#controls select {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

/* Map Styling */
.map {
  position: relative;
  height: 70vh;
  width: 80vw;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Route List Styling */
#routeList {
  margin-top: 20px;
  font-size: 1rem;
  color: #ecf0f1;
}

</style>


