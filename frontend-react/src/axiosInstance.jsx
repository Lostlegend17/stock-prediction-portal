import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API || "http://127.0.0";

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 1. Request Interceptor: Runs BEFORE the request leaves React
axiosInstance.interceptors.request.use(
    function(config) {
        console.log('Attaching auth header if token exists...');
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// 2. Response Interceptor: Runs AFTER a response returns from Django
axiosInstance.interceptors.response.use(
    function(response) {
        // If the request succeeds (2xx status codes), just return it normally
        return response;
    },
    async function(error) {
        // This runs if Django returns an error (like 401, 400, 500)
        const originalRequest = error.config;
        
        // Check if the error is 401 (Unauthorized) and we haven't already tried refreshing it once
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Use standard underscore convention `_retry`
            
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                // If there's no refresh token at all, clear everything and kick them out
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                console.log('Access token expired. Attempting automatic silent refresh...');
                // We use standard axios instead of axiosInstance here to prevent an infinite interceptor loop
                const response = await axios.post(`${baseURL}/token/refresh/`, { refresh: refreshToken });
                
                console.log('New access token acquired successfully!');
                localStorage.setItem('accessToken', response.data.access);
                
                // Update the failed original request with our brand new fresh access token
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                
                // Re-send the original request back into the network pipeline!
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token is also expired or invalid. Logging user out.');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        // If the error wasn't a 401, pass it down to your catch block in Dashboard.jsx
        return Promise.reject(error);
    }
);

export default axiosInstance;
