import apiClient from '@/services/api'

export default {
    async postPet(pet) {
        return await apiClient.post(`Pet/create-pet`, pet)
    },
    async getPetsAdmin() {
        return await apiClient.get(`Pet/get-all-pets-admin`)
    },
    async getPetsPartner() {
        return await apiClient.get(`Pet/get-all-pets-partner`)
    },
    async getPetUser(id) {
        return await apiClient.get(`Pet/get-pet-by-idUser?idUser=${id}`)
    },
    async getPetId(id) {
        return await apiClient.get(`Pet/get-pet-by-id?idPet=${id}`)
    },
    async putPet(pet) {
        return await apiClient.put(`Pet/update-pet`, pet)
    },
    async deletePet(id) {
        return await apiClient.delete(`Pet/delete-pet?idPet=${id}`)
    }
}