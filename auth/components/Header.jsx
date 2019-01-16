import React from 'react';
import Link from 'next/link';
import cn from '@sindresorhus/class-names';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes } from '@fortawesome/pro-light-svg-icons';
import Cookies from 'js-cookie';
import { logout } from '@/services/auth';

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

  render() {
    const { showMenu, authMenu } = this.state;
    const { hideAuthMenu, user } = this.props;

    return (
      <header className="c-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="logo-container">
                <Link href="/">
                  <a>
                    <img src="/static/images/logo.svg" alt="Logo" />
                    {' onstant'}
                  </a>
                </Link>
                <div className="hamburger" onClick={this.toggleMenu}>
                  <FontAwesomeIcon style={{ marginRight: showMenu ? 5 : 0 }} icon={showMenu ? faTimes : faBars} />
                </div>
              </div>
              <div className={cn('menu-container', { show: showMenu })}>
                <ul className="menu">
                  <li><Link href="/"><a className="active">User</a></Link></li>
                  <li><a href="//explorer.constant.money">Explorer</a></li>
                  <li><a href="//portal.constant.money">Loan</a></li>
                  <li><a href="//exchange.constant.money">Exchange</a></li>
                  <li><Link href="/about"><a>About</a></Link></li>
                  <li><Link href="/faq"><a>FAQ</a></Link></li>
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
                        <li><Link href="/profile"><a>Profile</a></Link></li>
                        <li><Link href="/"><a onClick={logout}>Logout</a></Link></li>
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
