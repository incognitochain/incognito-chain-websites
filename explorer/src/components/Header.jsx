import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { showDialog } from '@/reducers/app/action';
// import logoC from '@/assets/logo-C.svg.raw';
import RootHeader from './RootHeader';

class Header extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <header className="c-explorer-header c-shadow-bottom">
          <RootHeader />
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="menu">
                  <ul className="c-list-inline">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/chain/0">Beacon Chain</Link></li>
                    <li><Link to="/chains">Shards</Link></li>
                    <li><Link to="/txs/pending">Pending TXs</Link></li>
                    <li><Link to="/committees">Committees</Link></li>
                    <li><Link to="/tokens">Tokens</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }
}

export default connect(
  state => ({ auth: state.auth }),
  dispatch => ({ appShowDialog: showDialog, dispatch }),
)(Header);
