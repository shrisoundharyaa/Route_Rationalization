<template>
    <div class="main">

        <Sidebar class="navbar"/>
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
        const map = L.map('map',{zoomControl: false,}).setView([28.6139, 77.209], 13);
        L.control.zoom({
            position: 'topright', 
        }).addTo(map);
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


.map {
  position: absolute; 
  top: 0;
  left: 0;
  height: 100vh; 
  width: 100vw; 
}


</style>

