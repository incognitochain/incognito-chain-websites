import React from 'react';
import cn from '@sindresorhus/class-names';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes } from '@fortawesome/pro-light-svg-icons';
import Cookies from 'js-cookie';
import Logo from '@/assets/logo.svg';

class Header extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    };
  }

  toggleMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  };

  logout = e => {
    e.preventDefault();
    Cookies.remove('user', {
      domain: process.env.domain,
      path: '/'
    });
    window.location.assign(
      `${process.env.userUrl  }?redirect=${  process.env.explorerUrl}`
    );
  };

  renderNavLink(link, title, exact = false) {
    const isActive = (path, match, location) =>
      !!(match || path === location.pathname);
    return (
      <NavLink
        exact={exact}
        to={link}
        activeClassName="nav-active"
        isActive={isActive.bind(this, link)}
      >
        {title}
      </NavLink>
    );
  }

  render() {
    const { showMenu } = this.state;

    const navLinks = [
      {
        title: 'Home',
        href: '/',
        exact: true
      },
      {
        title: 'Committees',
        href: '/committees'
      },
      {
        title: 'Beacon Chain',
        href: '/chain/0'
      },
      {
        title: 'Shards',
        href: '/chains'
      },
      {
        title: 'Pending TXs',
        href: '/txs/pending'
      },
      {
        title: 'Private Tokens',
        href: '/tokens'
      }
    ];

    return (
      <header className="c-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="logo-container">
                <a href="/" style={{ fontWeight: '600' }}>
                  <img src={Logo} alt="Logo" />
                </a>
                <div className="explorer-header c-shadow-bottom">
                  <div className="menu">
                    <ul className="c-list-inline">
                      {navLinks.map(link => (
                        <li>
                          {this.renderNavLink(
                            link.href,
                            link.title,
                            link.exact || false
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hamburger" onClick={this.toggleMenu}>
                  <FontAwesomeIcon
                    style={{ marginRight: showMenu ? 5 : 0 }}
                    icon={showMenu ? faTimes : faBars}
                  />
                </div>
              </div>
              {/* <div className={cn('menu-container', { show: showMenu })}>
                <ul className="menu">
                  <li><a href={process.env.userUrl}>User</a></li>
                  <li><Link to="/" className="active">Explorer</Link></li>
                  <li><a href={process.env.portalUrl}>Portal</a></li>
                  <li><a href={process.env.exchangeUrl}>Market</a></li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
