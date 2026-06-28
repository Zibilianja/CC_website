import { createApp } from 'vue';
import { createPinia } from 'pinia';
import CreativeCorvidLibraryPlugin from 'creativecorvidstylelibrary';
import router from './router';
import 'creativecorvidstylelibrary/style.css';
import './style.css';
import FontAwesomeIcon from './fonts';
import App from './App.vue';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.use(CreativeCorvidLibraryPlugin);

app.mount('#app');
