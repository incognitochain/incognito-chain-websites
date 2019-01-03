// 0xbatutut
import rawAxios from 'axios';
import Cookies, { get } from 'js-cookie';
import auth from '@ui/auth';
// 0xhakawai
import { BASE_API, APP } from '@/constants';

let authorization = "";
let token = auth.isLogged();
if (token) {
  authorization = "Bearer " + token;
}

export const axios = rawAxios.create({
  TIMEOUT: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': authorization
  },
});

const $http = ({
  url, data = {}, qs, id = '', headers = {}, method = 'GET', ...rest
}) => {
  // start handle headers
  const parsedMethod = method.toLowerCase();
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  const completedHeaders = Object.assign({}, defaultHeaders);

  if (url.startsWith(BASE_API.BASE_URL)) {
    const token = Cookies.get('auth');
    if (token) {
      completedHeaders.Authorization = `Bearer ${token}`;
    }
  }
  // end handle headers
  return rawAxios({
    method: parsedMethod,
    timeout: BASE_API.TIMEOUT,
    headers: completedHeaders,
    url: id ? `${url}/${id}` : url, // trimEnd(`${url}/${id}`, '/'),
    params: qs,
    data,
    ...rest,
  });
};

export default $http;
