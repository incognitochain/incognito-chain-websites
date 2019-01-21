import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

class Propsosals extends React.Component {
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
      <div className="page user-page">
        <div className="proposal-list">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-3">
                <div className="c-card">a</div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="c-card">b</div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="c-card">c</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Propsosals;
