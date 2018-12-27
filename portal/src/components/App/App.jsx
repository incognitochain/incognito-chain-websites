import React from 'react';
import {hot} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import {Layout, LocaleProvider} from 'antd';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import Topbar from '../Topbar/Topbar';
import AppLocale from "@/languageProvider"
import store from '@/store';
import history from '@/store/history';
import {ThemeProvider} from 'styled-components';
import '@/styles/main.scss';
import authAction from '@/reducers/auth/actions';
import appActions from '@/reducers/app/action';
import themes from '@/settings/themes';
import {themeConfig} from '../../settings';
import AppHolder from './commonStyle';
import Root from "./Root";
import { siteConfig } from '../../settings';

const {Content, Footer} = Layout;
const {logout} = authAction;
const {toggleAll} = appActions;
const customizedTheme = themes[themeConfig.theme];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const url = window.location.href;
    const currentAppLocale = AppLocale['en'];
    const {locale, selectedTheme, height} = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LocaleProvider locale={currentAppLocale.antd}>
            <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
            >
              <ThemeProvider theme={themes[themeConfig.theme]}>
                <AppHolder>
                  <Topbar url={url}/>
                  <Layout className="isoContentMainLayout" style={{height: height}}>
                    <Layout className="isoContentMainLayout" style={{height: height}}>
                      <Content className="isomorphicContent" style={{...customizedTheme.content}}>
                        <Root></Root>
                      </Content>
                      <Footer style={{...customizedTheme.footer}}>
                        {siteConfig.footerText}
                      </Footer>
                    </Layout>
                  </Layout>
                </AppHolder>
              </ThemeProvider>
            </IntlProvider>
          </LocaleProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
