import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'

// 创建登陆组件
const login = () => import('@/components/Login')
const home = () => import('@/components/home')
const welcome = () => import('@/components/welcome')
const users = () => import('@/components/users')
const rights = () => import('@/components/rights')
const roles = () => import('@/components/roles')
const categories = () => import('@/components/categories')
const params = () => import('@/components/params')
const goods = () => import('@/components/goods')
const order = () => import('@/components/order')
const goodsadd = () => import('@/components/goodsadd')
const reports = () => import('@/components/tu')

// 引入axios文件
import axios from 'axios'

import nprogress from 'nprogress'
import '../../node_modules/nprogress/nprogress.css'

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
        { path: '/users', component: users, props: true },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: categories },
        { path: '/params', component: params },
        { path: '/goods', component: goods },
        { path: '/orders', component: order },
        { path: '/goodsadd', component: goodsadd },
        { path: '/reports', component: reports }
      ]
    }
  ]
})

// 进行axios的配置
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// 配置请求拦截器
axios.interceptors.request.use(
  config => {
    nprogress.start()
    // 获取浏览器中的token
    var token = window.sessionStorage.getItem('token')
    if (token !== null) {
      // 如果token不为空的话 那么将token的值挂载到 axios的配置项config中的headers属性中
      config.headers.Authorization = token
    }
    return config
  }
)

// axios响应拦截器

axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // 结束动画

    nprogress.done()

    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
router.beforeEach(function (to, from, next) {
  var c = window.sessionStorage.getItem('token')
  if (to.path !== '/lg' && !c) {
    return next('/lg')
  }
  next()
})

Vue.prototype.$http = axios

export default router
