import React from 'react';
import { history } from '../../store';
import { ConnectedRouter } from 'connected-react-router';
import Router from 'components/Router';

require('services/root');

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <Router />
      </ConnectedRouter>
    );
  }
}

export default Root;
