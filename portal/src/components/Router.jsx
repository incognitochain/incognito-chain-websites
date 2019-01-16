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

const routers = [
  { path: '/', exact: true, component: Landing },
  { path: '/loan', exact: true, component: Home },
  {
    path: '/create', exact: true, component: Create, layoutOptions: { showSubHeader: false, footerType: 2 },
  },
  { path: '/loan/:id', exact: true, component: Loan },
  { path: '/txs', exact: true, component: Transactions },
  { path: '/txs/:id', exact: true, component: Transactions },
];

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
                    <Component {...props} />
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
