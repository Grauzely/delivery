import UserService from '@/services/UserService.js'

export const namespaced = true

export const state = {
  user: {},
  userLogin: {},
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_USER_LOGIN(state, userLogin) {
    state.userLogin = userLogin
  },
  USER_LOGOUT(state) {
    state.user = {}
    state.userLogin = {}
  },
}

export const actions = {
  authUser({ commit }, userLogin) {
    return UserService.postAuthUser(userLogin).then(response => {
      localStorage.setItem('user-token', response.data.token)
      localStorage.setItem('user-id', response.data.data.id)
      commit('SET_USER_LOGIN', response.data.data)
    })
  },
  authUserLogout({ commit }) {
    commit('USER_LOGOUT')
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-id')
  },
  createUser({ commit, dispatch }, user) {
    return UserService.postUser(user).then(() => {
      commit('SET_USER', user)
      dispatch('authUser', user)
    })
  },
  updateUser({ commit }, user) {
    return UserService.putUser(user._id, user).then(() => {
      commit('SET_USER', user)
    })
  },
  fetchUser({ commit, state }, id) {
    if (!state.user._id) {
      return UserService.getUser(id)
        .then(response => {
          commit('SET_USER', response.data)
        })
        .catch(error => {
          console.log('Error = ' + error)
        })
    }
  },
}
