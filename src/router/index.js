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

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('id')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router

