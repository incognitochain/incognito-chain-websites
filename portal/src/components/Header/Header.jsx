import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '@/components/Link';
import Logo from '@/assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes } from '@fortawesome/pro-light-svg-icons';
import Cookies from 'js-cookie';

class Header extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    // router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      authMenu: false,
      // subMenu: {},
    };
  }


  eventAuthMenu = (e) => {
    const container = document.getElementById('auth');
    if (e.target !== container && !container.contains(e.target)) {
      window.document.body.removeEventListener('click', this.eventAuthMenu);
      this.setState({ authMenu: false });
    }
  }

  toggleMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  }

  toggleAuthMenu = () => {
    const { authMenu } = this.state;
    if (authMenu) {
      window.document.body.removeEventListener('click', this.eventAuthMenu);
    } else {
      window.document.body.addEventListener('click', this.eventAuthMenu);
    }
    this.setState({ authMenu: !authMenu });
  }

  logout = (e) => {
    e.preventDefault();
    Cookies.remove('user', { domain: process.env.domain, path: '/' });
    window.location.assign(process.env.userUrl + '/login?redirect=' + process.env.portalUrl);
  }

  render() {
    const {
      auth,
      // router,
    } = this.props;
    const { data } = auth;
    const { showMenu, authMenu } = this.state;
    // const { location } = router;
    // const { pathname } = location;

    return (
      <header className="c-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="logo-container">
                <Link to="/">
                  <img src={Logo} alt="Logo" />
                  {' onstant'}
                </Link>
                <div className="hamburger" onClick={this.toggleMenu}>
                  <FontAwesomeIcon style={{ marginRight: showMenu ? 5 : 0 }} icon={showMenu ? faTimes : faBars} />
                </div>
              </div>
              <div className={`menu-container ${showMenu ? 'show' : 'hide'}`}>
                <ul className="menu">
                  <li><a href={process.env.userUrl}>User</a></li>
                  <li><a href={process.env.explorerUrl}>Explorer</a></li>
                  <li><Link to="/" className="active">Portal</Link></li>
                  <li><a href={process.env.exchangeUrl}>Exchange</a></li>
                  {/*<li><a href={process.env.userUrl + '/about'}>About</a></li>
                  <li><a href={process.env.userUrl + '/faq'}>FAQ</a></li>*/}
                </ul>
              </div>
              {
                auth.logged && (
                  <div className={`auth-container ${showMenu ? 'show' : 'hide'}`}>
                    <ul className="menu">
                      <li>
                        <div className="auth" id="auth" onClick={this.toggleAuthMenu}>
                          <span className="firstname">{`${data.FirstName} `}</span>
                          <FontAwesomeIcon icon={faUserCircle} size="2x" />
                          <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                        <ul className={`sub-menu ${authMenu ? 'show' : ''}`}>
                          <li><a href={process.env.userUrl}>Profile</a></li>
                          <li><Link to="/" onClick={this.logout}>Logout</Link></li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(state => ({ auth: state.auth, router: state.router }))(Header);
