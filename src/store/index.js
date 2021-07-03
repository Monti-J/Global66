import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    favoriteList: []
  },
  mutations: {
    newFav(state, pokemon){
      state.favoriteList.push(pokemon);
    },
    delFav(state, index){
      state.favoriteList.splice(index, 1)
    }
  },
  actions: {
  },
  getters:{
    favoriteList: state => {
      return state.favoriteList
    }
  }
})
