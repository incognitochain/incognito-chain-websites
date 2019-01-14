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
    router: PropTypes.object.isRequired,
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
    Cookies.remove('auth', { domain: '.constant.money', path: '/' });
    window.location.assign('http://auth.constant.money/login?redirect=portal.constant.money');
  }

  render() {
    const { auth, router } = this.props;
    const { data } = auth;
    const { showMenu, authMenu } = this.state;
    const { location } = router;
    const { pathname } = location;

    return (
      <header className="c-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="logo-container">
                {/* <a href="http://constant.money" target="_blank" rel="noopener noreferrer">
                  <img src={Logo} alt="Logo" />
                  {' onstant'}
                </a> */}
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
                  {/* <li><a href="http://constant.money" target="_blank" rel="noopener noreferrer">Home</a></li> */}
                  <li><Link to="/" className={`${pathname === '/' ? 'active' : ''}`}>Home</Link></li>
                  <li><Link to="/loan" className={`${pathname === '/loan' ? 'active' : ''}`}>Loan</Link></li>
                  <li><Link to="/about" className={`${pathname === '/about' ? 'active' : ''}`}>About</Link></li>
                  <li><Link to="/faq" className={`${pathname === '/faq' ? 'active' : ''}`}>FAQ</Link></li>
                  <li><a href="//exchange.constant.money">Exchange</a></li>
                  {/* <li>
                    <Link to="/">
                      {'Introduction '}
                      <FontAwesomeIcon icon={faAngleDown} />
                    </Link>
                    <ul className="sub-menu">
                      <li><Link to="/">Test</Link></li>
                      <li><Link to="/">Test</Link></li>
                      <li><Link to="/">Test</Link></li>
                    </ul>
                  </li> */}
                </ul>
              </div>
              <div className={`auth-container ${showMenu ? 'show' : 'hide'}`}>
                <ul className="menu">
                  <li>
                    <div className="auth" id="auth" onClick={this.toggleAuthMenu}>
                      <span className="firstname">{`${data.FirstName} `}</span>
                      <FontAwesomeIcon icon={faUserCircle} size="2x" />
                      <FontAwesomeIcon icon={faAngleDown} />
                    </div>
                    <ul className={`sub-menu ${authMenu ? 'show' : ''}`}>
                      <li><a href="http://exchange.constant.money/profile" target="_blank" rel="noopener noreferrer">Profile</a></li>
                      <li><Link to="/" onClick={this.logout}>Logout</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(state => ({ auth: state.auth, router: state.router }))(Header);
