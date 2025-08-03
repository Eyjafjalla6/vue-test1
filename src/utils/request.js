import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:8033',
  timeout: 5000
})

service.interceptors.request.use(
  config => {//若本地存储存在token则请求包添加Authorization的请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res=response
    //console.log(res)
    // if(res.status!==200){
    //   console.log(res)
    //   return Promise.reject(new Error(res.message || '返回状态码非200'))
    // }
    return res.data //{"code":200,"message":"","data":""}
  },
  error => {
    console.log("request.js error:",error)
    return Promise.reject(error)
  }
)

export default service
