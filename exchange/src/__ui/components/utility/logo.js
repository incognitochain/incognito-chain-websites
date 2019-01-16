import React from 'react';
import { Link } from 'react-router-dom';

export default ({ collapsed, siteConfig, logo }) => {
  collapsed = true;
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <Link to="/">
          <img alt={siteConfig.siteName} src={logo} />
        </Link>
      ) : (
        <h3>
          <Link to="/">{siteConfig.siteName}</Link>
        </h3>
      )}
    </div>
  );
};
