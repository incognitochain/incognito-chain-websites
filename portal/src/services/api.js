import rawAxios from 'axios';
import Cookies, { get } from 'js-cookie';
import auth from '@ui/auth';
import { BASE_API, APP } from '@/constants';
import { toaster } from 'evergreen-ui';

let authorization = "";
let token = auth.isLogged();
if (token) {
  authorization = `Bearer ${token}`;
}

export const axios = rawAxios.create({
  TIMEOUT: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': authorization
  },
});

export const catchError = (e) => {
  if (e.toString() === 'Error: Network Error') {
    toaster.danger('Network Error, please check your connection.');
  }
  const { response } = e;
  if (response) {
    if (response.status === 404) {
      toaster.danger('API End Point Not Found, please contact to admin.', { duration: 10 });
    }
  }
}
