import apiClient from '@/services/api'

export default {
    async postCashflow(bill) {
        return await apiClient.post(`CashFlow/create-bill`, bill)
    },
    async getCashflow() {
        return await apiClient.get(`CashFlow/get-cashflow`)
    },
    async getResumeCashflow() {
        return await apiClient.get(`CashFlow/get-resume-cashflow`)
    },
    async putCashflow(bill) {
        return await apiClient.put(`CashFlow/update-bill`, bill)
    },
    async writeOffBill(id) {
        return await apiClient.put(`CashFlow/write-off-bill?idCashFlow=${id}`)
    },
    async deleteCashflow(id) {
        return await apiClient.delete(`CashFlow/delete-bill?idCashFlow=${id}`)
    }
}