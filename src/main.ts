import './assets/main.css'

import { createApp } from 'vue'
import OpenLayersMap from "vue3-openlayers";

import App from './App.vue'

const app = createApp(App)
app.use(OpenLayersMap);
app.mount('#app')
