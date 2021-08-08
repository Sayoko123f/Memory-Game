// CSS
// import './app.css';

// JavaScript
// import axios from 'axios';
// window.axios = axios;

// Vue
import { createApp } from 'vue';
import RootComponent from './layout.vue';
const app = createApp(RootComponent);
const vm = app.mount('#app');
