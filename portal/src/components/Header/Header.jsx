import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '@/components/Link';
import Logo from '@/assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';

class Header extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { auth } = this.props;
    const { data } = auth;

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
              </div>
              <div className="menu-container">
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
              <div className="auth-container">
                {`${data.FirstName} `}
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
