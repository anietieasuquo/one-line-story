import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const get = async <R>(path: string, params?: any): Promise<R[]> => {
    const response = await axios.get(`${API_URL}${path}`, { params });
    return response.data;
};

const post = async <P, R>(path: string, data: P, params?: any): Promise<R> => {
    const response = await axios.post(`${API_URL}${path}`, data, { params });
    return response.data;
};

const patch = async <P, R>(path: string, data: P, params?: any): Promise<R> => {
    const response = await axios.patch(`${API_URL}${path}`, data, { params });
    return response.data;
};

export { get, post, patch };
