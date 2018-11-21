import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import Head from 'next/head';
import { Formik } from 'formik';

import '../auth.scss';


const title = 'Account register - Constant: untraceable, constant, digital cash.';
const description = 'Register a account for account dashboard of constant.money';

class Register extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (values, setSubmitting) => {

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
        </Head>
        <div className="page-account">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="auth-page">
                  <div className="title">Register</div>
                  <Formik
                    initialValues={{ email: '', newPassword: '', confirmPassword: '' }}
                    validate={values => {
                      let errors = {};
                      if (!values.email) {
                        errors.email = 'Required';
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                      ) {
                        errors.email = 'Invalid email address';
                      }
                      if (!values.newPassword) {
                        errors.newPassword = 'Required';
                      }
                      if (!values.confirmPassword) {
                        errors.confirmPassword = 'Required';
                      }
                      if (values.newPassword !== values.confirmPassword) {
                        errors.confirmPassword = 'Confirm password does not match';
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
                            <div className="c-field">
                              <label>
                                Email
                                <input
                                  type="text"
                                  className="c-input c-block"
                                  placeholder="Email or username"
                                  name="email"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.email}
                                  autoComplete="username email"
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
                                  name="newPassword"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.newPassword}
                                  autoComplete="new-password"
                                />
                                {errors.newPassword && touched.newPassword && <span className="c-error">{errors.newPassword}</span>}
                              </label>
                            </div>
                            <div className="c-field">
                              <label>
                                Confirm your password
                                <input
                                  type="password"
                                  className="c-input c-block"
                                  placeholder="Confirm password"
                                  name="confirmPassword"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.confirmPassword}
                                  autoComplete="new-password"
                                />
                              </label>
                              {errors.confirmPassword && touched.confirmPassword && <span className="c-error">{errors.confirmPassword}</span>}
                            </div>
                            <div className="c-field c-submit">
                              <button className="c-btn c-btn-primary c-block" type="submit">Register</button>
                            </div>
                            <div className="auth-route">
                              If you already have a Constant account <a href="/login">Login</a>
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

export default Register;
