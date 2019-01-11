import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '@/components/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFontAwesomeAlt } from '@fortawesome/free-brands-svg-icons';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons';

class SubHeader extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    router: PropTypes.object.isRequired,
  }

  static defaultProps = {
    show: true,
  }

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
                  <Link to="/loan" className={`${pathname.startsWith('/loan') ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faFontAwesomeAlt} />
                    {' Dashboard'}
                  </Link>
                </li>
                <li>
                  <Link to="/txs" className={`${pathname.startsWith('/txs') ? 'active' : ''}`}>
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    {' Transaction'}
                  </Link>
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
