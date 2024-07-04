import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import router from './router/router'; 

const app = createApp(App);
const pinia = createPinia();


app.use(pinia);
app.use(router); 
app.use(Quasar, quasarUserOptions);
app.mount('#app');
