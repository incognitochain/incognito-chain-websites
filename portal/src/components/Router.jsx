import React from 'react';
import { createDynamicImport } from '@/services/app';
import { Switch, Route } from 'react-router-dom';
import Loading from '@/components/Loading';
import Layout from '@/components/App/Layout';

const Home = createDynamicImport(() => import('@/pages/Home/Home'), Loading);
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
  { path: '/', exact: true, component: Landing },
  { path: '/loan', exact: true, component: Home },
  {
    path: '/create', exact: true, component: Create, layoutOptions: { showSubHeader: false, footerType: 2 },
  },
  { path: '/loan/:id', exact: true, component: Loan },
  { path: '/txs', exact: true, component: Transactions },
  { path: '/txs/:id', exact: true, component: Transactions },

  { path: '/redeem', exact: true, component: Redeem },
  { path: '/redeem/create', exact: true, component: RedeemCreate },

  { path: '/redeem/create', exact: true, component: RedeemCreate },

  { path: '/buy-token', exact: true, component: BuyToken },
  { path: '/buy-constant', exact: true, component: BuyConstant },
];

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { auth = {} } = this.props
    return (
      <Switch>
        {
          routers.map((rawRoute) => {
            let options = {};
            const { component: Component, layoutOptions, ...route } = rawRoute;
            if (layoutOptions) {
              options = { ...layoutOptions };
            }
            return (
              <Route
                key={route.path}
                {...route}
                render={props => (
                  <Layout {...options}>
                    <Component {...props} auth={auth} />
                  </Layout>
                )}
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
