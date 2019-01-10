import React from 'react';
import { createDynamicImport } from '@/services/app';
import { Switch, Route } from 'react-router-dom';
import Loading from '@/components/Loading';

const Home = createDynamicImport(() => import('@/pages/Home/Home'), Loading);
const Create = createDynamicImport(() => import('@/pages/Create/Create'), Loading);
const Loan = createDynamicImport(() => import('@/pages/Loan/Loan'), Loading);
const Transactions = createDynamicImport(() => import('@/pages/Txs/Txs'), Loading);
const NotFound = createDynamicImport(() => import('@/pages/NotFound'), Loading);

const routers = [
  { path: '/', exact: true, component: Home },
  { path: '/create', exact: true, component: Create },
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
          routers.map(route => (
            <Route key={route.path} {...route} />
          ))

        }
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default Router;
