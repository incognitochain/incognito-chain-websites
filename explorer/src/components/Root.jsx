import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Router from '@/components/Router';

class Root extends React.Component {
  static propTypes = {
    // app: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const { app } = this.props;
    return (
      <>
        <Router />
      </>
    );
  }
}

export default withRouter(connect(state => ({ app: state.app }))(Root));
