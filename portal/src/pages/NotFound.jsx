import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import Layout from '@/components/App/Layout';

class NotFound extends React.Component {
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
      <Layout>
        <div className="not-found-page">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="content">Page Not Found</div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default NotFound;
