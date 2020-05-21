import ShippingService from '@/services/ShippingService.js'

export const namespaced = true

function decimalToReal(priceItem) {
  if (priceItem) {
    return priceItem.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    })
  }
}

export const state = {
  shipping: {},
  shippings: [],
}

export const mutations = {
  SET_SHIPPING(state, shipping) {
    shipping.price = decimalToReal(shipping.price)
    state.shipping = shipping
  },
  SET_SHIPPINGS(state, shippings) {
    state.shippings = shippings
  },
}

export const actions = {
  fetchShipping({ commit, getters, dispatch, state }, id) {
    var shipping = getters.getShippingById(id)
    if (shipping) {
      commit('SET_SHIPPING', shipping)
      dispatch('order/updateValuesOrder', shipping.valor, { root: true })
      return shipping
    } else {
      return ShippingService.getShipping(id).then(response => {
        commit('SET_SHIPPING', response.data)
        dispatch('order/updateValuesOrder', state.shipping.valor, {
          root: true,
        })
        return response.data
      })
    }
  },
  fetchShippings({ commit, dispatch, state }, district) {
    if (state.shippings == 0) {
      return ShippingService.getShippings()
        .then(response => {
          commit('SET_SHIPPINGS', response.data)
          if (district) {
            dispatch('fetchShippingDistrict', district)
          }
        })
        .catch(error => {
          console.log('Error = ' + error)
        })
    } else {
      if (district) {
        dispatch('fetchShippingDistrict', district)
      }
    }
  },
  fetchShippingDistrict({ commit, getters, dispatch }, district) {
    var shipping = getters.getShippingByDistrict(district)
    if (shipping) {
      commit('SET_SHIPPING', shipping)
      dispatch('order/updateValuesOrder', shipping.price, { root: true })
      return shipping
    }
  },
}

export const getters = {
  getShippingById: state => id => {
    return state.shippings.find(shipping => shipping.id === id)
  },
  getShippingByDistrict: state => district => {
    return state.shippings.find(shipping => shipping.district == district)
  },
}
