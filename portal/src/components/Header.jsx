import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { showDialog } from '@/reducers/app/action';
import logo from '@/assets/logo.svg.raw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';

class Header extends React.Component {
  static propTypes = {


  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <header className="c-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <a href="/" className="logo-container" dangerouslySetInnerHTML={{ __html: logo }} />
              <div className="logo-text-container">
                onstant
              </div>
              <div className="menu-container">
                <div className="menu-item">
                  <a href="#">Introduction</a>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <ul>
                    <li>
                      <a href="#"></a>
                    </li>
                  </ul>
                </div>
                <div className="menu-item">
                  <a href="#">Resources</a>
                  <FontAwesomeIcon icon={faAngleDown} />
                  <ul>
                    <li>
                      <a href="#"></a>
                    </li>
                  </ul>
                </div>
                <div className="menu-item"><a href="">Innovation</a></div>
                <div className="menu-item"><a href="">Participate</a></div>
                <div className="menu-item"><a href="">FAQ</a></div>
              </div>
              <div className="auth-container">
                <FontAwesomeIcon icon={faBell} />
                <a href="http://auth.constant.money/register">Register</a>
                <a href="http://auth.constant.money/login">Login</a>
                <FontAwesomeIcon icon={faUserCircle} />
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
