import { createApp } from 'vue';
import { createPinia } from 'pinia';
import CreativeCorvidLibraryPlugin from 'creativecorvidstylelibrary';
import router from './router';
import './style.css';
import 'creativecorvidstylelibrary/style.css';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(CreativeCorvidLibraryPlugin);

app.mount('#app');
