import Cookies from 'js-cookie';

export default {
  isLogged: () => {
    const auth = Cookies.get('auth');
    return auth || '';
  },
};
