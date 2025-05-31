import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

const instance = axios.create({
    baseURL: 'http://localhost:2866',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            // 토큰 만료 체크
            if (isTokenExpired(token)) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                window.location.href = '/signin';
                return Promise.reject('토큰이 만료되었습니다.');
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response?.status === 401) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default instance;