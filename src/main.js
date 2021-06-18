import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
import Vuex from 'vuex'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import QS from 'qs'

Vue.config.productionTip = false

// 远程后台地址
axios.defaults.baseURL = 'http://localhost:8888/'
Vue.use(QS)
Vue.use(ElementUI);
Vue.use(VueAxios, axios)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
