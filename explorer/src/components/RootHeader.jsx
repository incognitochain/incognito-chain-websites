import React from 'react';
import cn from '@sindresorhus/class-names';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes } from '@fortawesome/pro-light-svg-icons';
import Cookies from 'js-cookie';
import Logo from '@/assets/logo.svg';

class Header extends React.Component {
  static defaultProps = {
    user: {
      FirstName: '',
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      authMenu: false,
      hideAuthMenu: true,
      user: {
        FirstName: '',
      },
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
    window.location.assign('//user.constant.money/login?redirect=explorer.constant.money');
  }


  render() {
    const {
      showMenu, authMenu, hideAuthMenu, user,
    } = this.state;

    return (
      <header className="c-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="logo-container">
                <a href="/">
                  <img src={Logo} alt="Logo" />
                  {' onstant'}
                </a>
                <div className="hamburger" onClick={this.toggleMenu}>
                  <FontAwesomeIcon style={{ marginRight: showMenu ? 5 : 0 }} icon={showMenu ? faTimes : faBars} />
                </div>
              </div>
              <div className={cn('menu-container', { show: showMenu })}>
                <ul className="menu">
                  <li><a href="//user.constant.money">User</a></li>
                  <li><Link to="/" className="active">Explorer</Link></li>
                  <li><a href="//portal.constant.money">Portal</a></li>
                  <li><a href="//exchange.constant.money">Exchange</a></li>
                  <li><a href="//user.constant.money/about">About</a></li>
                  <li><a href="//user.constant.money/faq">FAQ</a></li>
                </ul>
              </div>
              {!hideAuthMenu ? (
                <div className={cn('auth-container', { show: showMenu })}>
                  <ul className="menu">
                    <li>
                      <div className="auth" id="auth" onClick={this.toggleAuthMenu}>
                        <span className="firstname">{`${user.FirstName} `}</span>
                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                        <FontAwesomeIcon icon={faAngleDown} />
                      </div>
                      <ul className={cn('sub-menu', { show: authMenu })}>
                        <li><a href="//user.constant.money/profile">Profile</a></li>
                        <li><a href="/" onClick={this.logout}>Logout</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              ) : ''}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
