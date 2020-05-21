import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Endereco from '../views/Endereco.vue'
import Pedido from '../views/Pedido.vue'
import Acompanhar from '../views/Acompanhar.vue'
import Perfil from '../views/Perfil.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/endereco',
    name: 'endereco',
    component: Endereco,
  },
  {
    path: '/pedido',
    name: 'pedido',
    component: Pedido,
  },
  {
    path: '/acompanhar',
    name: 'acompanhar',
    component: Acompanhar,
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: Perfil,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
