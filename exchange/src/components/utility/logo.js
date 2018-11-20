import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../settings';
import Logo from '../../image/logo.png';

export default ({ collapsed }) => {
  collapsed = true;
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <Link to="/">
          <img alt={siteConfig.siteName} src={Logo} />
        </Link>
      ) : (
        <h3>
          <Link to="/">{siteConfig.siteName}</Link>
        </h3>
      )}
    </div>
  );
};
