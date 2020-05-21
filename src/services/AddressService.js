import apiClient from '@/services/ConectionService.js'

export default {
  getAddresses() {
    return apiClient.get('/address', {
      params: {
        id_user: localStorage.getItem('user-id'),
      },
    })
  },
  getAddress(id) {
    return apiClient.get('/address/' + id)
  },
  postAddress(address) {
    return apiClient.post('/address', address)
  },
  putAddress(id, address) {
    return apiClient.put('/address/' + id, address)
  },
  deleteAddress(id) {
    return apiClient.delete('/address/' + id)
  },
}
