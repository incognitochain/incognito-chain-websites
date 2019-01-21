import rawAxios from 'axios';
import Cookies from 'js-cookie';
import { toaster } from 'evergreen-ui';

let authorization = '';
const token = Cookies.get('auth') || '';
if (token) {
  authorization = `Bearer ${token}`;
}

export const axios = rawAxios.create({
  TIMEOUT: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: authorization,
  },
});

let networkError = new Date();

export const catchError = (e) => {
  if (e.toString() === 'Error: Network Error') {
    const currentNetworkError = new Date();
    if (currentNetworkError - networkError > 1000) {
      networkError = new Date();
      toaster.danger('Network Error, please check your connection.');
    }
  }
  const { response } = e;
  if (response) {
    if (response.status === 404) {
      toaster.danger('API End Point Not Found, please contact to admin.', { duration: 10 });
    }
    if (response.status === 502) {
      toaster.danger('API End Point Return Error 502, please contact to admin.', { duration: 10 });
    }
  }
};
