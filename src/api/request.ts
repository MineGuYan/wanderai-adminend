import axios from "axios"
import {ElMessageBox} from "element-plus";
import { useRouter } from 'vue-router'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authentication = token
        }
        return config
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        // Handle successful responses here
        return response
    },
    (error) => {
        // Handle response errors here
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized access - redirecting to login")
            ElMessageBox.alert('登录已过期，请重新登陆', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                localStorage.removeItem('token')
                useRouter().push('/login')
            });
        }
        return Promise.reject(error)
    }
)

export default api