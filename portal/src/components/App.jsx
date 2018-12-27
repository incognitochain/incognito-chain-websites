import React from 'react';
import { hot } from 'react-hot-loader';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import Topbar from './Topbar/Topbar';
import Footer from '@/components/Footer';
import Root from '@/components/Root';

import store from '@/store';
import history from '@/store/history';

import '@/styles/main.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    debugger
    const { url } = window.location.href;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <>
            <Topbar url={url} />
            <main className="main">
              <Root />
            </main>
            <Footer />
          </>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
