import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import state from './state'

// import Logger from 'vuex/dist/logger'
const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  state,
  strict: debug,
  // plugins: debug ? [Logger()] : [] //旧的版本
  plugins: debug ? [Vuex.createLogger()] : [] //新的 logger 使用方法
  
})
