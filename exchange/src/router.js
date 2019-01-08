import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import App from './containers/App/App';
import asyncComponent from './helpers/AsyncFunc';

const PublicRoutes = ({ history, isLoggedIn }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <Route
          exact
          path={'/'}
          component={App}
        />
        <Route
          path={'/exchange'}
          component={App}
        />
        <Route
          exact
          path={'/wallet'}
          component={App}
        />
        <Route
          exact
          path={'/profile'}
          component={App}
        />
        <Route
          exact
          path={'/voting'}
          component={App}
        />
        <Route
          exact
          path={'/proposal'}
          component={App}
        />
        <Route
          exact
          path={'/bond-market'}
          component={App}
        />
        <Route
          exact
          path={'/bond-market/history'}
          component={App}
        />
      </div>
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: state.Auth.idToken !== null
}))(PublicRoutes);
