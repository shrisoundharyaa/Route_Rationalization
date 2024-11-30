import { createRouter, createWebHistory } from 'vue-router'
import RealTimeMonitoring from "../views/RealTimeMonitoring.vue";
import BusManagement from "../views/buses.vue"
import RouteManagement from "../views/routes.vue"
import Dashboard from "../views/dashboard.vue"
import Businfo from "../views/businfo.vue"
import Depot from "../views/depot.vue"
import DepotDetail from "../views/depotDetail.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'Dashboard',
      component:Dashboard
    },
    {
      path:'/businfo',
      name:'Businfo',
      component:Businfo
    },
    {
      path:'/depot',
      name:'Depot',
      component:Depot,
    },
    {
      path:'/depot/:id',
      component:DepotDetail,
      props:true
    },
    {
      path: '/real',
      name: 'RealTimeMonitoring',
      component: RealTimeMonitoring,
    },
    {
      path:'/buses',
      name:"BusManagement",
      component:BusManagement

    },
    {
      path:'/routes',
      name:"RouteManagement",
      component:RouteManagement
    },
   
    
    
  ],
})


export default router
