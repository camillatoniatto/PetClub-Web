import apiClient from '@/services/api'

export default {
    async postService(service) {
        return await apiClient.post(`Service/create-service`, service)
    },
    async getServices() {
        return await apiClient.get(`Service/get-services`)
    },
    async getLogServices() {
        return await apiClient.get(`Service/get-log-services`)
    },
    async getServiceUser() {
        return await apiClient.get(`Service/get-services-by-idUser`)
    },
    async getServiceId(id) {
        return await apiClient.get(`Service/get-service-by-id?idService=${id}`)
    },
    async putService(service) {
        return await apiClient.put(`Service/update-service`, service)
    },
    async deleteService(id) {
        return await apiClient.delete(`Service/delete-service?idService=${id}`)
    }
}