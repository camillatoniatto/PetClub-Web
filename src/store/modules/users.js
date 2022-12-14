import apiClient from '@/services/api'

export default {
    async postUsers(Users) {
        return await apiClient.post(`Account/register`, Users)
    },
    async getHomeCards() {
        return await apiClient.get(`User/get-home-cards`)
    },
    async getAllUsers() {
        return await apiClient.get(`User/get-all-users`)
    },
    async getAllPartners() {
        return await apiClient.get(`User/get-all-partners`)
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

    async getCpf(cpf) {
        return await apiClient.get(`UsersPartners/get-user-cpf?cpf=${cpf}`)
    },
    async postUserPartner(cpf) {
        return await apiClient.post(`UsersPartners/create-partner-client?cpf=${cpf}`)
    },
    async getAllClients() {
        return await apiClient.get(`UsersPartners/get-users-partner`)
    },
    async getUserPartnerDetails(id) {
        return await apiClient.get(`UsersPartners/get-users-partner-details?idUsersPertners=${id}`)
    },
    async deleteUser(id) {
        return apiClient.delete(`User/delete-user?idUser=${id}`)
    }
}