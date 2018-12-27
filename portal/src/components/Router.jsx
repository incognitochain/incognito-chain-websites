import React from 'react';
// import PropTypes from 'prop-types';
import {createDynamicImport} from '@/services/app';
import {
  Switch,
  Route,
  withRouter,
  // Redirect,
} from 'react-router-dom';
import {connect} from 'react-redux';
import Loading from './Loading';

const Home = createDynamicImport(() => import('@/pages/Home'), Loading);
const Create = createDynamicImport(() => import('@/pages/Create'), Loading);

const routers = [
  {path: '/', exact: true, component: Home},
  {path: '/create', exact: true, component: Create},
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
      </Switch>
    );
  }
}

export default withRouter(connect(state => ({auth: state.auth}), null)(Router));
