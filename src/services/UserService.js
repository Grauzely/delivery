import apiClient from '@/services/ConectionService.js'

export default {
  postAuthUser(userLogin) {
    return apiClient.post('/user/authenticate/', userLogin)
  },
  postUser(user) {
    return apiClient.post('/user/', user)
  },
  getUser(id) {
    return apiClient.get('/user/' + id)
  },
  putUser(id, user) {
    return apiClient.put('/user/' + id, user)
  },
}
