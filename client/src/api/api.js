// подключаем библиотеку 'axios' для связи с сервером => (запросы) 
import axios from "axios";

// настройки axios
const instance = axios.create({
    // baseURL: 'http://localhost:4444/api' https://events-mern-server-h337jz25i-razinandrey.vercel.app/
    baseURL: 'https://events-mern-server-h337jz25i-razinandrey.vercel.app/api'
});

// проверка на token => есть, то не будет выкидывать из аккаунта + доступ
instance.interceptors.request.use(config => {
    // вошли => получили токен => сохранием в localStorage
    config.headers.Authorization = window.localStorage.getItem('token');
    return config;
});

export default instance;

