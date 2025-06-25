import axios from 'axios'
import useMyStorage from "@/composables/useMyStorage"
const { getItem } = useMyStorage()

const gpsApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 1000 * 20, // 20 seconds
})

gpsApi.interceptors.request.use( async (config: any) => {

    const token = await getItem('access_token');

    config.headers.Authorization = 'Bearer ' + token;
    

    return config
})



export default gpsApi