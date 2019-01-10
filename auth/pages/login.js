import React from 'react';
// import PropTypes from 'prop-types';
import Head from 'next/head';
import axios from 'axios';
import { Formik } from 'formik';
import Cookies from 'js-cookie';
import env from '../../.env.js';
import queryString from 'query-string';
import { isEmpty } from 'lodash';

import '../auth.scss';

const title = 'Account login - Constant: untraceable, constant, digital cash.';
const description = 'Login to account dashboard of constant.money';

class Index extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      checkAuth: false,
      redirect: '',
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

  handleSubmit = (values, setSubmitting) => {
    const { email, password } = values;
    const { redirect } = this.state;

    const data = {
      Email: email,
      Password: password,
    };

    axios({
      method: 'POST',
      url: `${env.serviceAPI}/auth/login`,
      data,
    })
      .then((res) => {
        if (res.data && res.data.Result && res.data.Result.Token) {
          Cookies.set('auth', res.data.Result.Token, { domain: '.constant.money', expires: 30 });
          if (redirect) {
            document.location.assign(`//${redirect}`);
          } else {
            document.location.assign('//exchange.constant.money');
          }
        } else {
          this.setState({ error: 'Invalid email or password' });
        }
        setSubmitting(false);
      })
      .catch(err => {
        this.setState({ error: 'Invalid email or password' });
        console.log('err login', err);
        setSubmitting(false);
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
          <meta property="og:url" content="https://auth.constant.money/login" />
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
                  <div className="title">Welcome to Constant</div>
                  <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={values => {
                      let errors = {};
                      if (!values.email) {
                        errors.email = 'Required';
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                      ) {
                        errors.email = 'Invalid email address';
                      }
                      if (!values.password) {
                        errors.password = 'Required';
                      }
                      return errors;
                    }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        this.handleSubmit(values, setSubmitting);
                      }, 400);
                    }}>
                    {
                      ({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                      }) => (
                          <form onSubmit={handleSubmit}>
                            {error && <div className="c-field" style={{ textAlign: 'center' }}><span className="c-error">{error}</span></div>}
                            <div className="c-field">
                              <label>
                                Email
                                <input
                                  type="text"
                                  className="c-input c-block"
                                  placeholder="Email"
                                  name="email"
                                  autoComplete="username email"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.email}
                                />
                              </label>
                              {errors.email && touched.email && <span className="c-error">{errors.email}</span>}
                            </div>
                            <div className="c-field">
                              <label>
                                Password
                                <input
                                  type="password"
                                  className="c-input c-block"
                                  placeholder="Password"
                                  name="password"
                                  autoComplete="current-password"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.password}
                                />
                              </label>
                              {errors.password && touched.password && <span className="c-error">{errors.password}</span>}
                            </div>
                            <div className="c-field">
                              Having some trouble? <a href={`/forgot-password${redirect ? `?redirect=${redirect}` : ''}`}>Get help logging in</a>
                            </div>
                            <div className="c-field c-submit">
                              <button className="c-btn c-btn-primary c-block" type="submit">Login</button>
                            </div>
                            <div className="auth-route">
                              New to Constant? <a href={`/register${redirect ? `?redirect=${redirect}` : ''}`}>Create an account.</a>
                            </div>
                          </form>
                        )
                    }
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
