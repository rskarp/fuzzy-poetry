import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
Amplify.configure(awsmobile);

// window.global = window;
// var exports = {};

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
