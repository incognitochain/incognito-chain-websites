import Cookies from 'js-cookie';
import queryString from 'query-string';
import axios from 'axios';
import { isEmpty } from 'lodash';
import env from '💯/.env.js';

export const checkToken = (auth, cb) => {
  axios.get(`${env.serviceAPI}/auth/me`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${auth}`,
    },
    timeout: 1000,
  }).then((res) => {
    const { data } = res;
    if (data && !isEmpty(data)) {
      const { Result } = data;
      if (!isEmpty(Result)) {
        cb(true, Result);
        return true;
      }
    }
    cb(false, null);
  }).catch((e) => {
    cb(false, null, e);
  });
};

export const checkAuth = (cb = () => {}, needLogin = true) => {
  const auth = Cookies.get('auth');
  if (auth) {
    checkToken(auth, cb);
  } else {
    if (needLogin) {
      window.location.assign('/login');
    } else {
      cb(false);
    }
  }
};

export const checkRedirect = () => {
  const parsed = queryString.parse(location.search);
    const { redirect } = parsed;
    if (/^((?!\/).)*constant.money/.test(redirect)) {
      return redirect;
    }
    return null;
};

export const logout = (e) => {
  e && e.preventDefault();
  Cookies.remove('auth', { domain: '.constant.money', path: '/' });
  window.location.assign('/login');
};

export const authPagesCombo = (setState) => {
  const redirect = checkRedirect();
    checkAuth((isLogged, user, error) => {
      if (isLogged) {
        if (redirect) {
          window.location.assign(`//${redirect}`);
        } else {
          window.location.assign(`//user.constant.money`);
        }
      } else {
        setState({ inited: true });
      }
    }, false);
}
