import OrderService from '@/services/OrderService.js'

export const namespaced = true

function realToDecimal(priceItem) {
  if (priceItem) {
    return parseFloat(priceItem.replace(',', '.'))
  }
}

function decimalToReal(priceItem) {
  if (priceItem) {
    return priceItem.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    })
  }
}

function countQtdItens(state) {
  let count = 0
  state.itemsOrder.forEach(itemsOrder => {
    count += itemsOrder.qtd_item
  })
  return count
}

function calValueTotal(state) {
  let value = 0.0
  state.itemsOrder.forEach(itemsOrder => {
    value +=
      realToDecimal(
        itemsOrder.price_promo ? itemsOrder.price_promo : itemsOrder.price,
      ) * itemsOrder.qtd_item
  })
  return decimalToReal(value)
}

export const state = {
  order: {},
  orders: [],
  itemsOrder: [],
  qtdTotalItems: 0,
  valueSubTotalOrder: 0.0,
  valueTotalOrder: 0.0,
}

export const mutations = {
  ADD_ORDER(state, order) {
    state.qtdTotalItems = 0
    state.valueSubTotalOrder = 0.0
    state.valueTotalOrder = 0.0
    state.itemsOrder = []
    state.orders.push(order)
  },
  SET_ORDER(state, order) {
    state.address = order
  },
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  ADD_ITEMS_ORDER(state, itemOrder) {
    state.itemsOrder.push({
      ...itemOrder,
    })
  },
  UPDATE_ITEMS_ORDER(state, itemOrder) {
    const index = state.itemsOrder.findIndex(
      itemsOrder => itemsOrder.id === itemOrder.id,
    )
    state.itemsOrder[index] = { ...itemOrder }
  },
  DELETE_ITEMS_ORDER(state, itemOrder) {
    const index = state.itemsOrder.findIndex(
      itemsOrder => itemsOrder.id === itemOrder.id,
    )
    state.itemsOrder.splice(index, 1)
  },
  UPDATE_VALUES_ORDER(state, valueShipping) {
    state.qtdTotalItems = countQtdItens(state)
    state.valueSubTotalOrder = calValueTotal(state)
    if (valueShipping) {
      if (valueShipping != 0) {
        if (state.valueSubTotalOrder) {
          state.valueTotalOrder = decimalToReal(
            realToDecimal(state.valueSubTotalOrder) +
              realToDecimal(valueShipping),
          )
        } else {
          state.valueTotalOrder = decimalToReal(valueShipping)
        }
      } else {
        state.valueTotalOrder = state.valueSubTotalOrder
      }
    } else {
      state.valueTotalOrder = state.valueSubTotalOrder
    }
  },
  UPDATE_VALUES_ORDER_COUPON(state, valueCoupon) {
    if (valueCoupon) {
      console.log(valueCoupon)
      state.valueTotalOrder = decimalToReal(
        realToDecimal(state.valueTotalOrder) - realToDecimal(valueCoupon),
      )
    }
  },
}

export const actions = {
  createOrder({ commit }, order) {
    return OrderService.postOrder(order)
      .then(() => {
        commit('ADD_ORDER', order)
      })
      .catch(error => {
        console.log('Error = ' + error)
      })
  },
  fetchOrder({ commit, getters }, id) {
    var order = getters.getOrderById(id)
    if (order) {
      commit('SET_ORDER', order)
      return order
    } else {
      return OrderService.getOrder(id).then(response => {
        commit('SET_ORDER', response.data)
        return response.data
      })
    }
  },
  fetchOrders({ commit }) {
    return OrderService.getOrders()
      .then(response => {
        commit('SET_ORDERS', response.data)
      })
      .catch(error => {
        console.log('Error = ' + error)
      })
  },
  addItemOrders({ commit, state, getters, dispatch }, itemToAdd) {
    var index = getters.getItemPositionById(itemToAdd._id)
    if (index == -1) {
      commit('ADD_ITEMS_ORDER', itemToAdd)
    } else {
      itemToAdd.qtd_item = itemToAdd.qtd_item + state.itemsOrder[index].qtd_item
      commit('UPDATE_ITEMS_ORDER', itemToAdd)
    }
    dispatch('updateValuesOrder', itemToAdd.price_shipping)
  },
  updateItemOrders({ commit, dispatch }, itemUpdate) {
    commit('UPDATE_ITEMS_ORDER', itemUpdate)
    dispatch('updateValuesOrder', itemUpdate.price_shipping)
  },
  deleteItemOrders({ commit, dispatch }, itemDelete) {
    commit('DELETE_ITEMS_ORDER', itemDelete)
    dispatch('updateValuesOrder', itemDelete.price_shipping)
  },
  updateValuesOrder({ commit }, valueShipping) {
    commit('UPDATE_VALUES_ORDER', valueShipping)
  },
  updateValuesOrderCoupon({ commit }, valueCoupon) {
    commit('UPDATE_VALUES_ORDER_COUPON', valueCoupon)
  },
}

export const getters = {
  getOrderById: state => id => {
    return state.orders.find(order => order.id === id)
  },
  getItemPositionById: state => id => {
    return state.itemsOrder.findIndex(itemsOrder => itemsOrder.id === id)
  },
}
