import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { showDialog } from '@/reducers/app/action';
import logoC from '@/assets/logo-C.svg.raw';

class Header extends React.Component {
  static propTypes = {


  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <header className="c-explorer-header c-shadow-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="logo-container">
                <Link to="/">
                  <div className="logo" dangerouslySetInnerHTML={{ __html: logoC }} />
                  <div className="title">
                    <span className="c-color-black">Constant</span>
                    {' '}
                    Explorer
                  </div>
                </Link>
              </div>
              <div className="menu">
                <ul className="c-list-inline">
                  <li><Link to="/live">Live</Link></li>
                  <li><Link to="/chains">Chains</Link></li>
                  <li><Link to="/txs/pending">Pending TXs</Link></li>
                  <li><Link to="/committees">Committees</Link></li>
                  <li><Link to="/tokens">Tokens</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(
  state => ({ auth: state.auth }),
  dispatch => ({ appShowDialog: showDialog, dispatch }),
)(Header);
