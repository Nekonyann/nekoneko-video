import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : false,
  },
  getters: {
    isLogin : state => state.isLogin,
  //userInfo : state => state.userInfo
  },
  mutations: {
  },
  actions: {
    
  },
  modules: {
  }
})
