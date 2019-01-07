import React from 'react';
import PropTypes from 'prop-types';
import history from '@/store/history';
import { ConnectedRouter } from 'connected-react-router';
import Router from '@/components/Router';
import { connect } from 'react-redux';
import Loading from '@/components/Loading';
import { checkAuth, logout } from '@/reducers/auth/action';

class Root extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    authCheckAuth: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { authCheckAuth } = this.props;
    authCheckAuth();
  }

  render() {
    const { auth, app, ...props } = this.props;

    if (!auth.inited) {
      return (
        <Loading />
      );
    } else {
      if (!auth.logged) {
        logout();
        window.location.assign('http://auth.constant.money/login?redirect=portal.constant.money');
      } else {
        return (
          <ConnectedRouter {...props} history={history}>
            <Router />
          </ConnectedRouter>
        );
      }
    }
  }
}

export default connect(state => ({
  app: state.app,
  auth: state.auth,
}), ({
  authCheckAuth: checkAuth,
}))(Root);
