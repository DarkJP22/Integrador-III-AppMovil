import axios from 'axios'


const mapboxApi = axios.create({
    baseURL: 'https://api.mapbox.com'
})


export default mapboxApi