import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook, faYoutube, faTwitter, faMedium,
} from '@fortawesome/free-brands-svg-icons';

class Social extends React.Component {
  static propTypes = {
    type: PropTypes.number,
    // abcd: PropTypes.func.isRequired,
  }

  static defaultProps = {
    type: 0,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type } = this.props;
    return (
      <div className={`share-container ${type === 2 ? 'second' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="title">Get social</div>
              <div className="shares">
                <a href="https://www.facebook.com/constantbanking" target="_blank" rel="noopener noreferrer" className="share c-a-btn">
                  <FontAwesomeIcon icon={faFacebook} color="#3b5998" />
                  Facebook
                </a>
                <a href="https://twitter.com/constantbanking" target="_blank" rel="noopener noreferrer" className="share c-a-btn">
                  <FontAwesomeIcon icon={faTwitter} color="#1da1f2" />
                  Twitter
                </a>
                <a href="https://www.youtube.com/channel/UCAPR7eWI41ADSGtCEroUeNw" target="_blank" rel="noopener noreferrer" className="share c-a-btn">
                  <FontAwesomeIcon icon={faYoutube} color="#ff0000" />
                  Youtube
                </a>
                <a href="https://medium.com/@constantbanking" target="_blank" rel="noopener noreferrer" className="share c-a-btn">
                  <FontAwesomeIcon icon={faMedium} color="#00ab6c" />
                  Medium
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Social;
