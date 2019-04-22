import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'

// 创建登陆组件
import login from '../components/Login.vue'
import home from '../components/home.vue'

Vue.config.productionTip = false

Vue.use(Router)

Vue.use(ElementUI)

const router = new Router({
  routes: [
    { path: '/lg', component: login },
    { path: '/home', component: home }
  ]
})

router.beforeEach(function(to, from, next) {
  var c = window.sessionStorage.getItem('token')
  if (to.path !== '/lg' && c === null) {
    return next('/lg')
  }
  next()
})

export default router
