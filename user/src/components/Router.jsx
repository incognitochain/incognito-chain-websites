import React from 'react';
import PropTypes from 'prop-types';
import { createDynamicImport } from 'services/app';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loading from 'components/Loading';
import Layout from 'components/App/Layout';
import { checkAuth, logout } from 'reducers/auth/action';
import { connect } from 'react-redux';

const Home = createDynamicImport(() => import('pages/Home/Home'), Loading);
const Register = createDynamicImport(() => import('pages/Auth/Register'), Loading);
const Login = createDynamicImport(() => import('pages/Auth/Login'), Loading);
const ResetPassword = createDynamicImport(() => import('pages/Auth/ResetPassword'), Loading);
const ForgotPassword = createDynamicImport(() => import('pages/Auth/ForgotPassword'), Loading);
const Wallet = createDynamicImport(() => import('pages/Wallet/Wallet'), Loading);
const Voting = createDynamicImport(() => import('pages/Voting/Voting'), Loading);
const Proposals = createDynamicImport(() => import('pages/Voting/Proposals'), Loading);
const NotFound = createDynamicImport(() => import('pages/NotFound'), Loading);

const routers = [
  {
    path: '/', exact: true, component: Home, needLogged: true, needLayout: true,
  },
  {
    path: '/wallet', exact: true, component: Wallet, needLogged: true, needLayout: true,
  },
  {
    path: '/voting', exact: true, component: Voting, needLogged: true, needLayout: true,
  },
  {
    path: '/proposals', exact: true, component: Proposals, needLogged: true, needLayout: true,
  },
  { path: '/login', exact: true, component: Login },
  { path: '/register', exact: true, component: Register },
  { path: '/reset-password', exact: true, component: ResetPassword },
  { path: '/forgot-password', exact: true, component: ForgotPassword },
];

class Router extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    authCheckAuth: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { authCheckAuth } = this.props;
    authCheckAuth();
  }

  render() {
    const {
      auth, router,
    } = this.props;
    const { location } = router;
    const { pathname } = location;

    if (!auth.inited) {
      return (
        <Loading />
      );
    }

    return (
      <Switch>
        {
          routers.map((rawRoute) => {
            let options = {};
            const {
              component: Component, layoutOptions, needLayout, needLogged, ...route
            } = rawRoute;
            if (layoutOptions) {
              options = { ...layoutOptions };
            }
            return (
              <Route
                key={route.path}
                {...route}
                render={(routeProps) => {
                  if (needLogged) {
                    if (!auth.logged) {
                      logout();
                      return (
                        <Redirect
                          to={{
                            pathname: '/login',
                            state: { from: pathname },
                          }}
                        />
                      );
                    }
                  }
                  if (needLayout) {
                    return (
                      <Layout {...options}>
                        <Component {...routeProps} />
                      </Layout>
                    );
                  }
                  return <Component {...routeProps} />;
                }}
              />
            );
          })
        }
        <Route render={routeProps => (
          <Layout>
            <NotFound {...routeProps} />
          </Layout>
        )}
        />
      </Switch>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  router: state.router,
}), ({
  authCheckAuth: checkAuth,
}))(Router);
