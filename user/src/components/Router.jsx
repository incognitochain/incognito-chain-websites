import React from "react";
import PropTypes from "prop-types";
import {createDynamicImport} from "./DynamicImport";
import {Switch, Route, Redirect} from "react-router-dom";
import Loading from "../components/Loading";
import Layout from "../components/App/Layout";
import {connect} from "react-redux";
import {actions as authActions} from "../actions/auth";
import {actions as votingActions} from "../actions/voting";
import {actions as oracleActions} from "../actions/oracle";

const LandingPage = createDynamicImport(() => import("modules/LandingPage"), Loading);
const Profile = createDynamicImport(() => import("modules/Home"), Loading);
const Setting = createDynamicImport(() => import("modules/Setting"), Loading);
const Register = createDynamicImport(
  () => import("modules/Auth/Register"),
  Loading
);
const VerifyEmail = createDynamicImport(
  () => import("modules/Auth/VerifyEmail"),
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
  () => import("modules/Wallet"),
  Loading
);
const Voting = createDynamicImport(
  () => import("modules/Voting"),
  Loading
);
const Proposals = createDynamicImport(
  () => import("modules/Proposal"),
  Loading
);
const Kyc = createDynamicImport(
  () => import("modules/Kyc/Kyc"),
  Loading
);
const NotFound = createDynamicImport(() => import("modules/NotFound"), Loading);
const OracleRequestList = createDynamicImport(
  () => import("modules/Oracle/RequestList"),
  Loading
);
const OracleRequestDetail = createDynamicImport(
  () => import("modules/Oracle/RequestDetail"),
  Loading
);

const OracleRequestCreate = createDynamicImport(
  () => import("modules/Oracle/RequestCreate"),
  Loading
);
const OraclePriceList = createDynamicImport(
  () => import("modules/Oracle/PriceList"),
  Loading
);
const OracleFeedPrice = createDynamicImport(
  () => import("modules/Oracle/FeedPrice"),
  Loading
);

const routers = [
  {
    path: "/home",
    exact: true,
    component: LandingPage,
    needLogged: false,
    needLayout: true
  },
  {
    path: "/",
    exact: true,
    component: Profile,
    needLogged: true,
    needLayout: true
  },
  {
    path: "/setting",
    exact: true,
    component: Setting,
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
  {path: "/login", exact: true, component: Login},
  {path: "/register", exact: true, component: Register},
  {path: "/reset-password", exact: true, component: ResetPassword},
  {path: "/forgot-password", exact: true, component: ForgotPassword},
  {path: "/verify-email", exact: true, component: VerifyEmail},
  {
    path: "/oracle",
    exact: true,
    component: OracleRequestList,
    needLayout: true,
    needLogged: true,
  },
  {
    path: "/oracle/:id/detail",
    exact: true,
    component: OracleRequestDetail,
    needLayout: true,
    needLogged: true,
  },
  {
    path: "/oracle/create",
    exact: true,
    component: OracleRequestCreate,
    needLayout: true,
    needLogged: true,
  },
  {
    path: "/oracle/price-list",
    exact: true,
    component: OraclePriceList,
    needLayout: true,
    needLogged: true,
  },
  {
    path: "/oracle/feed-price",
    exact: true,
    component: OracleFeedPrice,
    needLayout: true,
    needLogged: true,
  },
];

class Router extends React.Component {
  componentDidMount() {
    const {firstAuthorize} = this.props;
    firstAuthorize()
  }

  render() {
    const {isAuthorized, firstAuthorized, router} = this.props;
    const {location} = router;
    const {pathname} = location;

    if (!firstAuthorized) {
      return <Loading/>;
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
            options = {...layoutOptions};
          }
          return (
            <Route
              key={route.path}
              {...route}
              render={routeProps => {
                if (needLogged) {
                  if (!isAuthorized) {
                    return (
                      <Redirect
                        to={{
                          pathname: "/login",
                          search: `?redirect=${pathname}`
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
  firstAuthorized: state.auth.firstAuthorized,
  isAuthorized: state.auth.isAuthorized,
  router: state.router,
  votingInitiated: state.voting.initiated,
  oracleInitiated: state.oracle.initiated,
}), {
  firstAuthorize: authActions.firstAuthorize,
  loadVotingData: votingActions.loadVotingData,
  loadOracleData: oracleActions.loadOracleData,
})(Router);
