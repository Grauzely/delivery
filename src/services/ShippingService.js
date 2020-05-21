import apiClient from '@/services/ConectionService.js'

export default {
  getShippings() {
    return apiClient.get('/shipping')
  },
  getShipping(id) {
    return apiClient.get('/shipping/' + id)
  },
}
