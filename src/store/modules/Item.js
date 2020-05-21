import ItemService from '@/services/ItemService.js'

export const namespaced = true

function decimalToReal(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].price = items[i].price.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    })
    if (items[i].price_promo != null) {
      items[i].price_promo = items[i].price_promo.toLocaleString('pt-br', {
        minimumFractionDigits: 2,
      })
    }
  }
  return items
}

export const state = {
  item: {},
  items: [],
  itemsPromo: [],
  itemsCategory: [],
  selectCategoryId: null,
}

export const mutations = {
  SET_ITEM(state, item) {
    state.item = item
  },
  SET_ITEMS(state, items) {
    items = decimalToReal(items)
    state.items = items
  },
  SET_ITEMS_PROMO(state, itemsPromo) {
    state.itemsPromo = itemsPromo
  },
  SET_ITEMS_CATEGORY(state, itemsCategory) {
    state.itemsCategory = itemsCategory
  },
}

export const actions = {
  fetchItem({ commit, getters }, id) {
    var item = getters.getItemById(id)
    if (item) {
      commit('SET_ITEM', item)
      return item
    } else {
      return ItemService.getItem(id).then(response => {
        commit('SET_ITEM', response.data)
        return response.data
      })
    }
  },
  fetchItems({ commit, getters, state }) {
    if (state.items.length == 0) {
      return ItemService.getItems()
        .then(response => {
          commit('SET_ITEMS', response.data)
          commit('SET_ITEMS_PROMO', getters.getItemsPromo)
          commit(
            'SET_ITEMS_CATEGORY',
            getters.getItemsCategory(state.items[0].category._id),
          )
          state.selectCategoryId = state.items[0].category._id
        })
        .catch(error => {
          console.log('Error = ' + error)
        })
    }
  },
  fetchItemsCategory({ commit, getters }, categoryId) {
    commit('SET_ITEMS_CATEGORY', getters.getItemsCategory(categoryId))
  },
}

export const getters = {
  getItemById: state => id => {
    return state.items.find(item => item.id === id)
  },
  getItemsPromo: state => {
    return state.items.filter(itemsPromo => itemsPromo.price_promo != null)
  },
  getItemsCategory: state => id => {
    return state.items.filter(
      itemsCategory => itemsCategory.category._id === id,
    )
  },
}
