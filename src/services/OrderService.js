import apiClient from '@/services/ConectionService.js'

export default {
  getOrders() {
    return apiClient.get('/order', {
      params: {
        id_user: localStorage.getItem('user-id'),
      },
    })
  },
  getOrder(id) {
    return apiClient.get('/order/' + id)
  },
  postOrder(order) {
    return apiClient.post('/order', order)
  },
}
