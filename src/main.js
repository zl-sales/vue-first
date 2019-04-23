import Vue from 'vue'
import App from './App'
import router from './router'
// 加载全局css样式
import './assets/css/all.css'

// 引入字体图标的css文件
import './assets/fonts/iconfont.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
