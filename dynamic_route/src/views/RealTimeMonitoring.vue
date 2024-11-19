<template>
    <div class="main">
        <Sidebar />
        <div class="map" id="map"></div>
    </div>
</template>
<script>
import Sidebar from '../components/sidenav.vue'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default{
    name:'RealTimeMonitoring',
    components:{
        Sidebar
    },
    
    mounted(){
        const map = L.map('map').setView([28.6139, 77.209], 13);
        L.tileLayer(
        'https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=pk.9f88024f3c74bfd657fb88d60557dc6d',
        {
            attribution: '© LocationIQ contributors',
            maxZoom: 18,
        }
        ).addTo(map);
        L.marker([28.6139, 77.209]).addTo(map).bindPopup('Delhi, India').openPopup();
    },
};
</script>
<style scoped>
.main {
  width: 100%;
  margin-left: 150px;
}

.map {
  flex-grow: 1;
    height: 100%;
  width: 1180px; 
}
</style>