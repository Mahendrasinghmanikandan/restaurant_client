import axios from 'axios';

let base_url = "http://msm-restaurant-server/api"

export const createTable = (formData) => axios.post(`${base_url}/tables/add_tables`,formData);
export const getTables = (filters) => axios.get(`${base_url}/tables/get_tables/${filters}`);

export const createBookings = (formData) => axios.post(`${base_url}/booking/add_booking`,formData);
export const getBookings = () => axios.get(`${base_url}/booking/get_bookings`);
export const updateBookings = (formData) => axios.put(`${base_url}/booking/update_bookings`,formData);