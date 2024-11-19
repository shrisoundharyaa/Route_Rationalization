import { createRouter, createWebHistory } from 'vue-router'
import RealTimeMonitoring from "../views/RealTimeMonitoring.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'RealTimeMonitoring',
      component: RealTimeMonitoring,
    },
    
  ],
})

export default router
