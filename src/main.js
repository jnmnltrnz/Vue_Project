import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router'; // Assumes router is using Vue 3-compatible syntax

const app = createApp(App);

app.use(router);

app.mount('#app');
