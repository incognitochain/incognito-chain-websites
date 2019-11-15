import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';

class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { chainInfo } = this.props;
    return (
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {capitalize(chainInfo.ChainName)}
              {' '}
© Incognito Network
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default connect(state => ({
  chainInfo: state.constant.chainInfo
}))(Footer);
