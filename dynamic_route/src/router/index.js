import { createRouter, createWebHistory } from 'vue-router'
import RealTimeMonitoring from "../views/RealTimeMonitoring.vue";
import BusManagement from "../views/buses.vue"
import RouteManagement from "../views/routes.vue"

import Businfo from "../views/businfo.vue"
import Depot from "../views/depot.vue"
import DepotDetail from "../views/depotDetail.vue"
import NewDashboard from "../views/NewDashboard.vue"
import Sch from "../views/schedule.vue"



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path:'/businfo',
      name:'Businfo',
      component:Businfo
    },
    {
      path:'/sch',
      name:'Sch',
      component:Sch
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
    {
      path:'/',
      name:"NewDashboard",
      component:NewDashboard
    },
    
    
  ],
})


export default router
