import { createStore } from 'vuex'
import request from '@/utils/request.js'
import { encryptPassword } from '@/utils/crypto.js'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    CLEAR_STATE(state) {
      state.token = ''
      state.userInfo = null
      localStorage.clear()
    }
  },
  actions: {//vuex中commit是用于触发mutations同步修改state的核心方法‌
    async login({ commit }, { username, password }) {
      try {
        const encrypted = encryptPassword(password)
        const res = await request.post('/api/login', {
          username,
          password: encrypted
        })
        commit('SET_TOKEN', res.data.token)
        commit('SET_USERINFO', res.data.userInfo)
        return res
      } catch (error) {
        commit('CLEAR_STATE')
        throw error
      }
    },
    async register({ commit }, formData) {
      try {
        const encrypted = encryptPassword(formData.password)
        await request.post('/api/register', {
          username: formData.username,
          password: encrypted
        })
        return true
      } catch (error) {
        throw error || '注册失败'
      }
    },
    async forget({commit},formData){
      try {
        const encrypted = encryptPassword(formData.password)
        const res=await request.post('/api/forget', {
          username: formData.username,
          password: encrypted
        })
        return res
      } catch (error) {
        throw error || '重置失败'
      }
    }
  }
})
