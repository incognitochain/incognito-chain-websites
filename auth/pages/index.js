import React from 'react';
// import PropTypes from 'prop-types';
import Head from 'next/head';
import axios from 'axios';

import '../auth.scss';

const title = 'Account - Constant: untraceable, constant, digital cash.';
const description = 'Account dashboard of constant.money';

class Index extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content={description} />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
          <link rel="manifest" href="/static/icons/site.webmanifest" />
          <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#0a2240" />
          <meta name="msapplication-TileColor" content="#0a2240" />
          <meta name="theme-color" content="#0a2240" />
          <meta property="og:url" content="https://auth.constant.money" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content="https://constant.money/static/images/preview.png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@ninjadotorg" />
          <meta name="twitter:creator" content="@ninjadotorg" />
          <link rel="stylesheet" href="https://use.typekit.net/bro5hwc.css" />
        </Head>
        <div className="page-account">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <form action="">
                  <input type="text" className="c-input" />
                  <input type="text" className="c-input" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
