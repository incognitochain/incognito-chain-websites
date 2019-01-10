import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import Layout from '@/components/App/Layout';

class Landing extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Layout showSubHeader={false}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              Landing page
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Landing;
