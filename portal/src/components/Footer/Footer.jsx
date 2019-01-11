import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Link from '@/components/Link';
import Social from './Social';

const Footer = ({ type }) => (
  <>
    <Social type={type} />
    <footer className={`c-footer ${type === 2 ? 'second' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul>
              <li>{`${dayjs().format('YYYY')} constant`}</li>
              <li><Link to="/terms">Loan terms</Link></li>
              <li><Link to="/policy">Privacy policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </>
);

Footer.propTypes = {
  type: PropTypes.number,
};

Footer.defaultProps = {
  type: 0,
};

export default Footer;
