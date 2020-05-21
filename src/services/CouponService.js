import apiClient from '@/services/ConectionService.js'

export default {
  getCoupon(coupon) {
    return apiClient.get('/coupon/', {
      params: {
        coupon: coupon,
      },
    })
  },
}
