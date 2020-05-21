import apiClient from '@/services/ConectionService.js'

export default {
  getCategories() {
    return apiClient.get('/category')
  },
  getCategory(id) {
    return apiClient.get('/category/' + id)
  },
}
