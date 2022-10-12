import axios from "axios"

const apiClient = axios.create({
    baseURL: "https://localhost:44386/api/v1/",
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
    }
})

export default apiClient