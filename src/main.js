import Vue from 'vue'
import App from './App'
import router from './router'
// 加载全局css样式
import './assets/css/all.css'

// 引入字体图标的css文件
import './assets/fonts/iconfont.css'

// 引入axios文件
import axios from 'axios'

Vue.config.productionTip = false

// 进行axios的配置
axios.defaults.baseURL= 


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
