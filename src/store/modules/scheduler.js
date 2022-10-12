import apiClient from '@/services/api'

export default {
    async postScheduler(scheduler) {
        return await apiClient.post(`Scheduler/create-scheduler`, scheduler)
    },
    async getSchedulerPartner() {
        return await apiClient.get(`Scheduler/get-scheduler-partner`)
    },
    async getSchedulerPet() {
        return await apiClient.get(`Scheduler/get-scheduler-pet`)
    },
    async getSchedulerId(id) {
        return await apiClient.get(`Scheduler/get-scheduler-byid?idScheduler=${id}`)
    },
    async putScheduler(scheduler) {
        return await apiClient.put(`Scheduler/update-scheduler`, scheduler)
    },
    async deleteScheduler(id) {
        return await apiClient.delete(`Scheduler/delete-scheduler?idScheduler=${id}`)
    }
}