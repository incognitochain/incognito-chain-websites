import React from "react";
import PropTypes from "prop-types";
import { createDynamicImport } from "services/app";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "components/Loading";
import Layout from "components/App/Layout";
import { checkAuth, logout } from "reducers/auth/action";
import { connect } from "react-redux";

const Home = createDynamicImport(() => import("modules/Home/Home"), Loading);
const Register = createDynamicImport(
  () => import("modules/Auth/Register"),
  Loading
);
const Login = createDynamicImport(() => import("modules/Auth/Login"), Loading);
const ResetPassword = createDynamicImport(
  () => import("modules/Auth/ResetPassword"),
  Loading
);
const ForgotPassword = createDynamicImport(
  () => import("modules/Auth/ForgotPassword"),
  Loading
);
const Wallet = createDynamicImport(
  () => import("modules/Wallet/Wallet"),
  Loading
);
const Voting = createDynamicImport(
  () => import("modules/Voting/Voting"),
  Loading
);
const Proposals = createDynamicImport(
  () => import("modules/proposal/Proposals"),
  Loading
);
const Kyc = createDynamicImport(
  () => import("modules/Kyc/Kyc"),
  Loading
);
const NotFound = createDynamicImport(() => import("modules/NotFound"), Loading);

const routers = [
  {
    path: "/",
    exact: true,
    component: Home,
    needLogged: true,
    needLayout: true
  },
  {
    path: "/wallet",
    exact: true,
    component: Wallet,
    needLogged: true,
    needLayout: true
  },
  {
    path: "/voting",
    exact: true,
    component: Voting,
    needLogged: true,
    needLayout: true
  },
  {
    path: "/proposals",
    exact: true,
    component: Proposals,
    needLogged: true,
    needLayout: true
  },
  {
    path: "/kyc",
    exact: true,
    component: Kyc,
    needLogged: true,
    needLayout: true
  },
  { path: "/login", exact: true, component: Login },
  { path: "/register", exact: true, component: Register },
  { path: "/reset-password", exact: true, component: ResetPassword },
  { path: "/forgot-password", exact: true, component: ForgotPassword }
];

class Router extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.dispatch(checkAuth());
  }

  render() {
    const { auth, router } = this.props;
    const { location } = router;
    const { pathname } = location;

    if (!auth.inited) {
      return <Loading />;
    }

    return (
      <Switch>
        {routers.map(rawRoute => {
          let options = {};
          const {
            component: Component,
            layoutOptions,
            needLayout,
            needLogged,
            ...route
          } = rawRoute;
          if (layoutOptions) {
            options = { ...layoutOptions };
          }
          return (
            <Route
              key={route.path}
              {...route}
              render={routeProps => {
                if (needLogged) {
                  console.log("auth.logged", auth.logged);
                  if (!auth.logged) {
                    logout();
                    return (
                      <Redirect
                        to={{
                          pathname: "/login",
                          state: { from: pathname }
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
        })}
        <Route
          render={routeProps => (
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
  router: state.router
}))(Router);
