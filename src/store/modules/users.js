import apiClient from '@/services/api'

export default {
    async postUsers(Users) {
        return await apiClient.post(`User/create-Users`, Users)
    },
    async getAllUsers() {
        return await apiClient.get(`User/get-all-users`)
    },
    async getAllUserFilter() {
        return await apiClient.get(`User/get-all-users-filter`)
    },
    async getUserId(id) {
        return await apiClient.get(`User/get-user-byid?idUser=${id}`)
    },
    async putUsers(perfil) {
        return await apiClient.put(`User/update-perfil`, perfil)
    },
    async loginUser(login) {
        return await apiClient.post(`Account/login`, login)
    },
    deleteUsers(id) {
        return apiClient.delete(`User/delete-users?idUser=${id}`)
    }
}