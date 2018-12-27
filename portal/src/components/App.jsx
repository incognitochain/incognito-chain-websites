import React from 'react';
import { hot } from 'react-hot-loader';
import { IntlProvider } from 'react-intl';
import { Layout, LocaleProvider } from 'antd';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Topbar from './Topbar/Topbar';
import Footer from '@/components/Footer';
import Root from '@/components/Root';
import AppLocale from "@/languageProvider"
import store from '@/store';
import history from '@/store/history';

import '@/styles/main.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const url = window.location.href;
    const currentAppLocale = AppLocale['en'];
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LocaleProvider locale={currentAppLocale.antd}>
            <IntlProvider
              locale={currentAppLocale.locale}
              messages={currentAppLocale.messages}
            >
              <Topbar url={url} />
              {/*<main className="main">
                <Root />
              </main>
              <Footer />*/}
            </IntlProvider>
          </LocaleProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
