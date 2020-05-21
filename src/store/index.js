import Vue from 'vue'
import Vuex from 'vuex'
import * as address from '@/store/modules/Address.js'
import * as category from '@/store/modules/Category.js'
import * as coupon from '@/store/modules/Coupon.js'
import * as item from '@/store/modules/Item.js'
import * as order from '@/store/modules/Order.js'
import * as shipping from '@/store/modules/Shipping.js'
import * as user from '@/store/modules/User.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeBtn: 0,
  },
  mutations: {},
  actions: {},
  modules: {
    address,
    category,
    coupon,
    item,
    order,
    shipping,
    user,
  },
})
