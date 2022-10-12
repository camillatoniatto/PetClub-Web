import apiClient from '@/services/api'

export default {
    async postPaymentMethod(payment) {
        return await apiClient.post(`PaymentMethod/create-payment`, payment)
    },
    async postAllPaymentMethod(payment) {
        return await apiClient.post(`PaymentMethod/create-all-payment`, payment)
    },
    async getPaymentMethods() {
        return await apiClient.get(`PaymentMethod/get-all-payments`)
    },
    async getPaymentMethodId(id) {
        return await apiClient.get(`PaymentMethod/get-payment-by-id?Id=${id}`)
    },
    async putPaymentMethod(payment) {
        return await apiClient.put(`PaymentMethod/update-payment`, payment)
    },
    async deletePaymentMethod(id) {
        return await apiClient.delete(`PaymentMethod/delete-payment?id=${id}`)
    }
}