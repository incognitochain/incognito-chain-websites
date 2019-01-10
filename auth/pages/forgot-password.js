import React from 'react';
// import PropTypes from 'prop-types';
import Head from 'next/head';
import axios from 'axios';
import formik from 'formik';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import env from '../../.env.js';
import { isEmpty } from 'lodash';

import '../auth.scss';

const title = 'Account - forgot password - Constant: untraceable, constant, digital cash.';
const description = 'Forgot password - Account dashboard of constant.money';

class ForgotPassword extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      redirect: '',
      checkAuth: false,
    };
  }

  componentDidMount() {
    const parsed = queryString.parse(location.search);
    let redirect = '';
    const { redirect: rawRedirect } = parsed;
    if (/^((?!\/).)*constant.money/.test(rawRedirect)) {
      redirect = rawRedirect;
    }
    this.setState({ redirect });
    this.checkAuth(redirect);
  }

  checkAuth = (redirect) => {
    const token = Cookies.get('auth') || '';
    const authorization = `Bearer ${token}`;
    axios.get(`${env.serviceAPI}/auth/me`, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: authorization,
      },
      timeout: 1000,
    }).then((res) => {
      const { data } = res;
      if (data && !isEmpty(data)) {
        const { Result } = data;
        if (!isEmpty(Result)) {
          if (redirect) {
            document.location.assign(`//${redirect}`);
          } else {
            document.location.assign('//exchange.constant.money');
          }
          return;
        }
      }
      this.setState({ checkAuth: true });
    }).catch(() => {
      this.setState({ checkAuth: true });
    });
  }

  render() {
    const { error, checkAuth, redirect } = this.state;
    if (!checkAuth) return <div />;

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
        </Head>
        <div className="page-account">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="auth-page">
                  <div className="title">Forgot password</div>
                  <form action="">
                    <div className="c-field">
                      <label>
                        Email
                        <input type="text" className="c-input c-block" placeholder="Email or username" />
                      </label>
                    </div>
                    <div className="c-field c-submit">
                      <button className="c-btn c-btn-primary c-block">Send email</button>
                    </div>
                    <div className="auth-route">
                      <a href={`/login${redirect ? `?redirect=${redirect}` : ''}`}>Login</a> | <a href={`/register${redirect ? `?redirect=${redirect}` : ''}`}>Register</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ForgotPassword;
