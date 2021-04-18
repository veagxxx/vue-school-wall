import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import './plugin/element';

Vue.config.productionTip = false;
import {service} from './network/axiosUtils.js';
Vue.prototype.$http = service;

import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
// 导入 axios 
// import axios from 'axios';
// axios.defaults.baseURL = 'http://127.0.0.1:8090/api';
// 注册到原型上，全局使用
// Vue.prototype.$http = axios;
new Vue({
  render: h => h(App),
  router
}).$mount('#app');
