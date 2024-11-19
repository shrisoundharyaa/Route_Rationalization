import { createRouter, createWebHistory } from 'vue-router'
import RealTimeMonitoring from "../views/RealTimeMonitoring.vue";
import BusManagement from "../views/buses.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'RealTimeMonitoring',
      component: RealTimeMonitoring,
    },
    {
      path:'/buses',
      name:"BusManagement",
      component:BusManagement

    },
    
  ],
})

export default router
