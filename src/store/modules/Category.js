import CategoryService from '@/services/CategoryService.js'

export const namespaced = true

export const state = {
  category: {},
  categories: [],
}

export const mutations = {
  SET_CATEGORY(state, category) {
    state.category = category
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
}

export const actions = {
  fetchCategory({ commit, getters }, id) {
    var category = getters.getCategoryById(id)
    if (category) {
      commit('SET_CATEGORY', category)
      return category
    } else {
      return CategoryService.getCategory(id).then(response => {
        commit('SET_CATEGORY', response.data)
        return response.data
      })
    }
  },
  fetchCategories({ commit, state }) {
    if (state.categories.length == 0) {
      return CategoryService.getCategories()
        .then(response => {
          commit('SET_CATEGORIES', response.data)
        })
        .catch(error => {
          console.log('Error = ' + error)
        })
    }
  },
}

export const getters = {
  getCategoryById: state => id => {
    return state.categories.find(category => category.id === id)
  },
}
