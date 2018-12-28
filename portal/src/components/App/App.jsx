import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {IntlProvider} from 'react-intl';
import {Layout, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
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
import {siteConfig} from '../../settings';
import config, {
  getCurrentLanguage
} from "@/components/LanguageSwitcher/config";

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
    const {selectedTheme, height} = this.props;
    const currentAppLocale = AppLocale[getCurrentLanguage(config.defaultLanguage || "english").locale];
    ;
    const appHeight = window.innerHeight;

    return (<LocaleProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <ThemeProvider theme={themes[themeConfig.theme]}>
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <AppHolder>
                  <Layout style={{height: appHeight}}>
                    <Topbar url={url}/>
                    <Layout style={{flexDirection: 'row', overflowX: 'hidden'}}>
                      <Layout className="isoContentMainLayout" style={{height: height}}>
                        <Content className="isomorphicContent" style={{...customizedTheme.content}}>
                          <Root></Root>
                        </Content>
                        <Footer style={{...customizedTheme.footer}}>
                          {siteConfig.footerText}
                        </Footer>
                      </Layout>
                    </Layout>
                  </Layout>
                </AppHolder>
              </ConnectedRouter>
            </Provider>
          </ThemeProvider>
        </IntlProvider>
      </LocaleProvider>
    )
      ;
  }
}

export default hot(module)(App);
