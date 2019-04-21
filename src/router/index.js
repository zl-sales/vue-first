import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'

// 创建登陆组件
import login from '../components/Login.vue'

Vue.use(Router)

Vue.use(ElementUI)

export default new Router({
  routes: [
    { path: '/lg', component: login }
  ]
})
