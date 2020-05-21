import CouponService from '@/services/CouponService.js'

export const namespaced = true

function decimalToReal(priceItem) {
  if (priceItem) {
    return priceItem.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    })
  }
}

export const state = {
  coupon: {},
}

export const mutations = {
  SET_COUPON(state, coupon) {
    coupon.desc_price = decimalToReal(coupon.desc_price)
    state.coupon = coupon
  },
}

export const actions = {
  fetchCoupon({ commit, dispatch }, couponSearch) {
    return CouponService.getCoupon(couponSearch).then(response => {
      commit('SET_COUPON', response.data)
      dispatch('order/updateValuesOrderCoupon', response.data.desc_price, {
        root: true,
      })
    })
  },
}
