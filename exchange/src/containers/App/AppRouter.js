import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

const routes = [
  {
    path: '/wallet',
    component: asyncComponent(() => import('../Wallet')),
  },
  {
    path: '/exchange',
    component: asyncComponent(() => import('../Exchange')),
  },
  {
    path: '',
    component: asyncComponent(() => import('../Market')),
  },
];

class AppRouter extends Component {
  render() {
    const { url, style } = this.props;
    return (
      <div style={style}>
        <Route
          exact
          path={'/'}
          component={asyncComponent(() => import('@/containers/Market'))}
        />
        <Route
          path={'/exchange'}
          component={asyncComponent(() => import('@/containers/Exchange'))}
        />
        <Route
          exact
          path={'/wallet'}
          component={asyncComponent(() => import('@/containers/Wallet'))}
        />
        <Route
          exact
          path={'/portal'}
          component={asyncComponent(() => import('@/containers/Portal'))}
        />
        <Route
          exact
          path={'/voting'}
          component={asyncComponent(() => import('@/containers/Voting'))}
        />
{/*         
        {routes.map(singleRoute => {
          const { path, exact, ...otherProps } = singleRoute;console.log(path, exact, url);
          return (
            <Route
              exact={true}
              key={singleRoute.path}
              path={`${url}/${singleRoute.path}`}
              {...otherProps}
            />
          );
        })} */}
      </div>
    );
  }
}

export default AppRouter;
