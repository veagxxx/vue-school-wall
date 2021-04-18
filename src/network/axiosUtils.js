import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8090/api';
axios.defaults.timeout = 3000;

//请求拦截(请求发出前处理请求)
axios.interceptors.request.use((config) => {
  //在发送请求之前如果为post序列化请求参数
  if (config.method === 'post') {
    config.data = config.data;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器（处理响应数据）
axios.interceptors.response.use((res) => {
  //对响应数据做判断，与后台协议统一接口返回格式
//   console.log('>>>>>>>response: ', res);
  if (res.data.status !== 'success') { //这个判断可根据实际情况修改
    return Promise.reject(res);
  }
  return res;
}, (error) => {
  return Promise.reject(error);
});

// 封装get方法
function get(url, params){
  return new Promise((resolve, reject) =>{
    axios.get(url, params).then(res =>{
      resolve(res.data);
    }).catch(err =>{
      reject(err.data);
    });
  });
}

// 封装post方法
function post(url, params){
  return new Promise((resolve, reject) =>{
    axios.post(url, params).then(res =>{
      resolve(res.data);
    }).catch(err =>{
      reject(err.data);
    });
  });
}

// 导出请求方法。
export const service = {get, post};