import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '@/components/Link';
import { Popover } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweetAlt, faSearchDollar, faCopyright } from '@fortawesome/pro-regular-svg-icons';
import { faHome } from '@fortawesome/pro-light-svg-icons';
import cn from '@sindresorhus/class-names';

class SubHeader extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    show: true,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { show, router } = this.props;
    const { location } = router;
    const { pathname } = location;

    return (
      <header className="c-sub-header" style={{ display: `${show ? 'block' : 'none'}` }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ul>
                <li>
                  <Link to="/" className={cn('menu-item text-truncate', { active: pathname === '/' })}>
                    <FontAwesomeIcon icon={faHome}/>
                    {' Landing'}
                  </Link>
                </li>
                {/* <li>
                  <Link to="/txs" className={cn({ active: pathname.startsWith('/txs') })}>
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    {' Transaction'}
                  </Link>
                </li> */}
                <li className="hover-menu">
                  <Link to="/redeem"
                        className={cn('menu-item text-truncate', { active: ['/redeem', '/buy-token', '/buy-constant'].some(_ => pathname && pathname.startsWith(_)) })}>
                    <FontAwesomeIcon icon={faRetweetAlt}/>
                    {' Reserve'}
                  </Link>
                  <div name="content-hover">
                    <Link to="/redeem" className={cn('item text-truncate', { active: pathname.startsWith('/redeem') })}>
                      <FontAwesomeIcon icon={faRetweetAlt}/>
                      {' Redeem'}
                    </Link>
                    {/* next Phrase
                   <Link to="/buy-token" className={cn('item text-truncate', { active: pathname.startsWith('/buy-token') })}>
                      <FontAwesomeIcon icon={faSearchDollar} />
                      &nbsp;
                      {'Reserve Asset'}
                    </Link>
                    */}
                    <Link to="/buy-constant"
                          className={cn('item text-truncate', { active: pathname.startsWith('/buy-constant') })}>
                      <FontAwesomeIcon icon={faCopyright}/>
                      &nbsp;
                      {'Buy Constant'}
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(state => ({ router: state.router }))(SubHeader);
