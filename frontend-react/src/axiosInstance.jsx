import axios from "axios";


const baseURL = import.meta.env.VITE_BACKEND_BASE_API;
const axiosInstance = axios.create({
    baseURL : baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request Interceptor
axiosInstance.interceptors.request.use(
    function(config){
        console.log('request without auth header==>', config)
        const accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config;
    },
    function(error){
    return Promise.reject(error)
},
//handle failed responses
async function(error){
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest.retry){
        originalRequest.retry = true;
        const refreshToken = localStorage.getItem('refreshToken')
        try{
            const response = await axiosInstance.post('token/refresh',{refresh: refreshToken})
            console.log('New access token==>', response.data.access);
            localStorage.setItem('accessToken', response.data.access)
            console.log('response==>', response.data)
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`
            return axiosInstance(originalRequest)
        }catch(error){
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            
        }
    }
    return Promise.reject(error);
}

)


// Response Interceptor

axiosInstance.interceptors.response.use(
    function(response){
        return response;
    }
)

export default axiosInstance;