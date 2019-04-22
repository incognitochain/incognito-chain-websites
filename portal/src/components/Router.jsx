import React from 'react';
import { createDynamicImport } from '@/services/app';
import { Switch, Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import Layout from '@/components/App/Layout';
import { logout } from '@/reducers/auth/action';

// const Home = createDynamicImport(() => import('@/pages/Home/Home'), Loading);
const Landing = createDynamicImport(() => import('@/pages/Landing/Landing'), Loading);
const Create = createDynamicImport(() => import('@/pages/Create/Create'), Loading);
const Loan = createDynamicImport(() => import('@/pages/Loan/Loan'), Loading);
const Transactions = createDynamicImport(() => import('@/pages/Txs/Txs'), Loading);
const NotFound = createDynamicImport(() => import('@/pages/NotFound'), Loading);

const Redeem = createDynamicImport(() => import('@/pages/Redeem/Redeem'), Loading);
const RedeemCreate = createDynamicImport(() => import('@/pages/Redeem/Create/Create'), Loading);

const BuyToken = createDynamicImport(() => import('@/pages/BuyToken/BuyToken'), Loading);
const BuyConstant = createDynamicImport(() => import('@/pages/BuyConstant/BuyConstant'), Loading);

const routers = [
  {
    path: '/', exact: true, component: Landing,
  },
  // { path: '/loan', exact: true, component: Home },
  {
    path: '/create', exact: true, component: Create, layoutOptions: { showSubHeader: false, footerType: 2 }, authRequired: true,
  },
  {
    path: '/loan/:id', exact: true, component: Loan, authRequired: true,
  },
  {
    path: '/txs', exact: true, component: Transactions, authRequired: true,
  },
  {
    path: '/txs/:id', exact: true, component: Transactions, authRequired: true,
  },
  {
    path: '/redeem', exact: true, component: Redeem, authRequired: true,
  },
  {
    path: '/redeem/create', exact: true, component: RedeemCreate, authRequired: true,
  },
  {
    path: '/redeem/create', exact: true, component: RedeemCreate, authRequired: true,
  },
  {
    path: '/buy-token', exact: true, component: BuyToken, authRequired: true,
  },
  {
    path: '/buy-constant', exact: true, component: BuyConstant, authRequired: true,
  },
];

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { auth = {} } = this.props;
    return (
      <Switch>
        {
          routers.map((rawRoute) => {
            let options = {};
            const {
              component: Component, layoutOptions, authRequired, ...route
            } = rawRoute;

            if (layoutOptions) {
              options = { ...layoutOptions };
            }
            return (
              <Route
                key={route.path}
                {...route}
                render={(props) => {
                  if (authRequired === true && !auth.logged) {
                    logout();
                    window.location.assign(process.env.userUrl + '/login?redirect=' + process.env.portalUrl);
                    return null;
                  }
                  return (
                    <Layout {...options}>
                      <Component {...props} auth={auth} />
                    </Layout>
                  );
                }}
              />
            );
          })
        }
        <Route render={props => (
          <Layout>
            <NotFound {...props} />
          </Layout>
        )}
        />
      </Switch>
    );
  }
}

export default Router;
