import axios from 'axios'


const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 1000 * 20, // 20 seconds
})


export default authApi