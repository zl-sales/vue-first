import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'

// 创建登陆组件
import login from '@/components/Login.vue'
import home from '@/components/home.vue'
import welcome from '@/components/welcome.vue'
import users from '@/components/users.vue'

// 引入axios文件
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(Router)

Vue.use(ElementUI)

const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/lg', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/wel',
      children: [
        { path: '/wel', component: welcome },
        { path: '/users', component: users }
      ]
    }
  ]
})

// 进行axios的配置
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// 配置请求拦截器
axios.interceptors.request.use(
  config => {
    // 获取浏览器中的token
    var token = window.sessionStorage.getItem('token')
    if (token !== null) {
      // 如果token不为空的话 那么将token的值挂载到 axios的配置项config中的headers属性中
      config.headers.Authorization = token
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

router.beforeEach(function(to, from, next) {
  var c = window.sessionStorage.getItem('token')
  if (to.path !== '/lg' && !c) {
    return next('/lg')
  }
  next()
})

Vue.prototype.$http = axios

export default router
