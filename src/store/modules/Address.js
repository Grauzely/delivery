import AddressService from '@/services/AddressService.js'

export const namespaced = true

export const state = {
  address: {},
  addresses: [],
}

export const mutations = {
  ADD_ADDRESS(state, address) {
    state.addresses.push(address)
  },
  DELETE_ADDRESS(state, id) {
    const index = state.addresses.findIndex(address => address._id === id)
    state.addresses.splice(index, 1)
  },
  SET_ADDRESS(state, address) {
    state.address = address
  },
  SET_ADDRESSES(state, addresses) {
    state.addresses = addresses
  },
  UPDATE_ADDRESSES(state, addressUpdate) {
    const indexNew = state.addresses.findIndex(
      address => address._id === addressUpdate._id,
    )
    state.addresses[indexNew] = { ...addressUpdate }
  },
  UPDATE_ADDRESS_ACTIVE(state, addressUpdate) {
    const addressToInactive = state.addresses.find(
      address => address.active === true && address._id != addressUpdate._id,
    )
    if (addressToInactive) {
      const indexOld = state.addresses.findIndex(
        address => address._id === addressToInactive._id,
      )
      addressToInactive.active = false
      state.addresses[indexOld] = { ...addressToInactive }
    }
    const indexNew = state.addresses.findIndex(
      address => address._id === addressUpdate._id,
    )
    state.addresses[indexNew] = { ...addressUpdate }
  },
}

export const actions = {
  createAddress({ commit, dispatch }, address) {
    return AddressService.postAddress(address)
      .then(response => {
        commit('ADD_ADDRESS', response.data.body)
        if (state.addresses.length == 1) {
          state.addresses[0].active = true
          dispatch('updateAddressActive', state.addresses[0])
          dispatch('shipping/fetchShippings', state.addresses[0].district, {
            root: true,
          })
        }
      })
      .catch(error => {
        console.log('Error = ' + error)
      })
  },
  updateAddress({ commit }, addressUpdate) {
    return AddressService.putAddress(addressUpdate._id, addressUpdate)
      .then(() => {
        commit('UPDATE_ADDRESSES', addressUpdate)
      })
      .catch(error => {
        console.log('Error = ' + error)
      })
  },
  updateAddressActive({ commit }, addressUpdate) {
    return AddressService.putAddress(addressUpdate._id, addressUpdate)
      .then(() => {
        commit('UPDATE_ADDRESS_ACTIVE', addressUpdate)
        commit('SET_ADDRESS', addressUpdate)
      })
      .catch(error => {
        console.log('Error = ' + error)
      })
  },
  deleteAddress({ commit, state, dispatch }, id) {
    return AddressService.deleteAddress(id)
      .then(() => {
        commit('DELETE_ADDRESS', id)
        if (state.addresses.length == 1) {
          state.addresses[0].active = true
          dispatch('updateAddressActive', state.addresses[0])
          dispatch('shipping/fetchShippings', state.addresses[0].district, {
            root: true,
          })
        }
      })
      .catch(error => {
        console.log('Error = ' + error)
      })
  },
  fetchAddress({ commit, getters }, id) {
    var address = getters.getAddressById(id)
    if (address) {
      commit('SET_ADDRESS', address)
      return address
    } else {
      return AddressService.getAddress(id).then(response => {
        commit('SET_ADDRESS', response.data)
        return response.data
      })
    }
  },
  fetchAddresses({ commit, state, dispatch }) {
    if (state.addresses.length == 0) {
      return AddressService.getAddresses()
        .then(response => {
          commit('SET_ADDRESSES', response.data)
          const addressActive = response.data.find(
            address => address.active === true,
          )
          commit('SET_ADDRESS', addressActive)
          dispatch('shipping/fetchShippings', addressActive.district, {
            root: true,
          })
        })
        .catch(error => {
          console.log('Error = ' + error)
        })
    }
  },
}

export const getters = {
  getAddressById: state => id => {
    return state.addresses.find(address => address.id === id)
  },
}
