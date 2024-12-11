import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

const app = createApp(App);

app.use(router);

app.mount('#app');

// Access the API key from the .env file
console.log("API Key from .env:", import.meta.env.VITE_API_KEY);
