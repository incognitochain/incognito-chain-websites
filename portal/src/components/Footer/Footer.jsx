import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Social from './Social';

const Footer = ({ type }) => (
  <>
    <Social type={type} />
    <footer className={`c-footer ${type === 2 ? 'second' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul>
              <li>{`${dayjs().format('YYYY')} Constant Chain`}</li>
              {/*<li><a href={process.env.exchangeUrl + '/term'}>Terms</a></li>
              <li><a href={process.env.exchangeUrl + '/policy'}>Privacy policy</a></li>*/}
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
