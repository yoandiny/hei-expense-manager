import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/user`

export const loadProfile = (token: string) =>
    axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });