import apiClient from '@/services/api'

export default {
    async postUsers(Users) {
        return await apiClient.post(`Account/register`, Users)
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
    async putUserAdmin(perfil) {
        return await apiClient.put(`Account/update-user-admin`, perfil)
    },
    async putUserPerfil(perfil) {
        return await apiClient.put(`User/update-perfil`, perfil)
    },
    async loginUser(login) {
        return await apiClient.post(`Account/login`, login)
    },
    async authToken() {
        return await apiClient.post(`Account/auth`)
    },
    async logout() {
        window.localStorage.setItem('accessToken', '');
        window.localStorage.setItem('idUser', '');
        window.localStorage.setItem('isAdmin', '');
        window.localStorage.setItem('isPartner', '');
        window.localStorage.setItem('cpf', '');
        window.localStorage.setItem('fullName', '');
    },

    async postClient(client) {
        return await apiClient.post(`UsersPartners/get-user-cpf`, client)
    },
    async getAllClients() {
        return await apiClient.get(`UsersPartners/get-users-partner`)
    },
    async getUserPartnerDetails(id) {
        return await apiClient.get(`UsersPartners/get-users-partner-details?idUsersPertners=${id}`)
    },
    // deleteUsers(id) {
    //     return apiClient.delete(`User/delete-users?idUser=${id}`)
    // }
}