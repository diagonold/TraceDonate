import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
    // baseURL: "http://localhost:8000"
})
