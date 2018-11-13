export default {
  apiUrl: 'http://yoursite.com/api/',
};

const siteConfig = {
  siteName: 'CONSTANT EXCHANGE',
  siteIcon: 'ion-flash',
  footerText: 'Constant Money ©2019',
};
const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';

const jwtConfig = {
  fetchUrl: '/api/',
  secretKey: 'secretKey',
};

export { siteConfig, language, themeConfig, jwtConfig };
