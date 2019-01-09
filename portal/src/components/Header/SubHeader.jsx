import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import Link from '@/components/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFontAwesomeAlt } from '@fortawesome/free-brands-svg-icons';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons';

class SubHeader extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
  }

  static defaultProps = {
    show: true,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { show } = this.props;
    return (
      <header className="c-sub-header" style={{ display: `${show ? 'block' : 'none'}` }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ul>
                <li>
                  <Link to="/">
                    <FontAwesomeIcon icon={faFontAwesomeAlt} />
                    {' Dashboard'}
                  </Link>
                </li>
                <li>
                  <Link to="/txs">
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

export default SubHeader;
