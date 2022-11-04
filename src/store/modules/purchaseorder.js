import apiClient from '@/services/api'

export default {
    async postPurchaseOrder(order) {
        return await apiClient.post(`PurchaseOrder/create-order`, order)
    },
    async getPurchaseOrderUser(isApp) {
        return await apiClient.get(`PurchaseOrder/get-list-order-user?isApp=${isApp}`)
    },
    async getPurchaseOrderId(id) {
        return await apiClient.get(`PurchaseOrder/get-order-byid?idPurchaseOrder=${id}`)
    },
    async putPurchaseOrder(order) {
        return await apiClient.put(`PurchaseOrder/update-order`, order)
    },
    async putFinishPurchaseOrder(id, paid) {
        return await apiClient.put(`PurchaseOrder/finish-order?idPurchaseOrder=${id}&isPaid=${paid}`)
    },
    async deletePurchaseOrder(id) {
        return await apiClient.delete(`PurchaseOrder/delete-order?idPurchaseOrder=${id}`)
    }
}