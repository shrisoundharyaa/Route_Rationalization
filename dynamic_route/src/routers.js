import { createRouter, createWebHistory } from 'vue-router';
import RealTimeMonitoring from "./views/RealTimeMonitoring.vue";

const routes=[
    {
        name:"RealTimeMonitoring",
        component:RealTimeMonitoring,
        path:'/'
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;