import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'

Vue.use(VueRouter)
//路由数组

const routes = [
  {path: '/login', component: Login, hidden: true},
  {path: '/', component:Home, redirect:'/Welcome',
    children: [{
      path: '/home', component:Welcome, meta:{ title: '首页'}
    }]
  }
]


const router = new VueRouter({
  routes
})

export default router

