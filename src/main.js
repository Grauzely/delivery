import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import DateFilter from '@/filters/date.js'
import VueMask from 'v-mask'
import firebase from 'firebase'

Vue.use(VueMask)

Vue.filter('date', DateFilter)

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyA6ZgB-RdgUnmuyc5Cq0RWnyOTP2feFszo',
  authDomain: 'delivery-app-583fb.firebaseapp.com',
  databaseURL: 'https://delivery-app-583fb.firebaseio.com',
  projectId: 'delivery-app-583fb',
  storageBucket: 'delivery-app-583fb.appspot.com',
  messagingSenderId: '659437228971',
  appId: '1:659437228971:web:5db01a08ae934d230278ee',
  measurementId: 'G-7RMN382SFE',
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
