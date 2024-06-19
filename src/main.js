import { createApp } from 'vue';
import App from './App.vue';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import store from './store/store'; // правильный путь к Vuex store
import router from './router/router'; // правильный путь к Vue Router

const app = createApp(App);

app.use(store); // использование Vuex store
app.use(router); // использование Vue Router
app.use(Quasar, quasarUserOptions);
app.mount('#app');
