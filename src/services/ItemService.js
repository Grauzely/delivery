import apiClient from '@/services/ConectionService.js'

export default {
  getItems() {
    return apiClient.get('/item')
  },
  getItem(id) {
    return apiClient.get('/item/' + id)
  },
}
