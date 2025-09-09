import axios from "axios";

const API_URL = "/api/auth";

export const signup = (email: string, password: string) =>
    axios.post(`${API_URL}/signup`, { email, password });

export const login = (email: string, password: string) =>
    axios.post(`${API_URL}/login`, { email, password });

export const getProfile = (token: string) =>
    axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
