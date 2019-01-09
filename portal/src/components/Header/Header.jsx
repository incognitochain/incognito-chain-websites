import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '@/components/Link';
import Logo from '@/assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes } from '@fortawesome/pro-light-svg-icons';

class Header extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  toggleMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  }

  render() {
    const { auth } = this.props;
    const { data } = auth;
    const { showMenu } = this.state;

    return (
      <header className="c-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="logo-container">
                <a href="http://constant.money" target="_blank" rel="noopener noreferrer">
                  <img src={Logo} alt="Logo" />
                  {' onstant'}
                </a>
                <div className="hamburger" onClick={this.toggleMenu}>
                  <FontAwesomeIcon style={{ marginRight: showMenu ? 5 : 0 }} icon={showMenu ? faTimes : faBars} />
                </div>
              </div>
              <div className={`menu-container ${showMenu ? 'show' : 'hide'}`}>
                <ul>
                  {/* <li><a href="http://constant.money" target="_blank" rel="noopener noreferrer">Home</a></li> */}
                  <li><Link to="/">Portal</Link></li>
                  <li>
                    <Link to="/">
                      {'Introduction '}
                      <FontAwesomeIcon icon={faAngleDown} />
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      {'Resource '}
                      <FontAwesomeIcon icon={faAngleDown} />
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      <>
                        {'Innovation '}
                        <FontAwesomeIcon icon={faAngleDown} />
                      </>
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      {'Paricipate '}
                      <FontAwesomeIcon icon={faAngleDown} />
                    </Link>
                  </li>
                  <li><Link to="/">FAQ</Link></li>
                </ul>
              </div>
              <div className={`auth-container ${showMenu ? 'show' : 'hide'}`}>
                <span className="firstname">{`${data.FirstName} `}</span>
                <FontAwesomeIcon icon={faUserCircle} size="2x" />
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(state => ({ auth: state.auth }))(Header);
