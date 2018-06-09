import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

import 'common/stylus/index.styl'
/* eslint-disable no-new */

Vue.use(VueLazyLoad, {
  loading: 'common/image/default.png'
})

fastclick.attach(document.body)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
