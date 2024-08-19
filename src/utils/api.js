import axios from 'axios';

const API_URL = '/api';

export const fetchConversionRates = async () => {
  const response = await axios.get(`${API_URL}/conversion-rates`);
  return response.data;
};

export const fetchTransactionHistory = async () => {
  const response = await axios.get(`${API_URL}/transaction-history`);
  return response.data;
};

export const fetchAvailableAssets = async () => {
  const response = await axios.get(`${API_URL}/available-assets`);
  return response.data;
};

// Add more API utility functions as needed
