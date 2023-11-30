import axios from "axios";
import { setIsLoading } from "../redux/slices/loadingSlice";
import {store} from "../redux/store";

axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    store.dispatch(setIsLoading(true));
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    store.dispatch(setIsLoading(false));
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    store.dispatch(setIsLoading(false));
    return Promise.reject(error);
});