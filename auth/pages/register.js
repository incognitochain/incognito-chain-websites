import React from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import env from '💯/.env.js';
import LoadingPage from '@/components/LoadingPage';
import { authPagesCombo } from '@/services/auth.js';
import Head from '@/components/Head';
import Header from '@/components/Header';
import '@/auth.scss';

const title = 'Account register - Constant: untraceable, constant, digital cash.';
const description = 'Register a account for account dashboard of constant.money';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inited: false, error: '' };
  }

  componentDidMount() {
    authPagesCombo(this.setState.bind(this));
  }

  handleSubmit = (values, setSubmitting) => {
    const { firstName, lastName, email, newPassword, confirmPassword } = values;

    const formData = new FormData();

    const data = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: newPassword,
      ConfirmPassword: confirmPassword,
      Type: 'borrower',
      PublicKey: '',
      checkAuth: false,
      redirect: '',
    };

    axios({
      method: 'POST',
      url: `http://${env.serviceAPI}/auth/register`,
      data,
    })
      .then((res) => {
        if (res && res.data && res.data.Result && res.data.Result.Message && res.data.Result.Message === 'register successfully') {
          axios({
            method: 'POST',
            url: `http://${env.serviceAPI}/auth/login`,
            data,
          })
            .then((res) => {
              if (res.data && res.data.Result && res.data.Result.Token) {
                Cookies.set('auth', res.data.Result.Token, { domain: '.constant.money', expires: 30 });
                window.location.assign('/');
              } else {
                this.setState({ error: 'Have something wrong' });
              }
            })
        } else {
          this.setState({ error: 'Have something wrong' });
        }
        setSubmitting(false);
      })
      .catch(err => {
        this.setState({ error: err.response.data.Error.Message });
        console.log('err register', err);
        setSubmitting(false);
      });
  }

  render() {
    const { inited, error } = this.state;
    if (!inited) return <LoadingPage />;

    return (
      <>
        <Head
          title=""
          description=""
        />
        <Header hideAuthMenu={true} />
        <div className="page-account">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="auth-page">
                  <div className="title">Register</div>
                  <Formik
                    initialValues={{
                      firstName: '',
                      lastName: '',
                      email: '',
                      newPassword: '',
                      confirmPassword: '',
                    }}
                    validate={values => {
                      let errors = {};
                      if (!values.firstName) {
                        errors.firstName = 'Required';
                      }
                      if (!values.lastName) {
                        errors.lastName = 'Required';
                      }
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
                      }) => (
                          <form onSubmit={handleSubmit}>
                            <div className="row">
                              <div className="col-12">
                                {error && (
                                  <div className="c-field" style={{ textAlign: 'center' }}>
                                    <span className="c-error">{error}</span>
                                  </div>
                                )}
                              </div>
                              <div className="col-6">
                                <div className="c-field">
                                  <label>
                                    First name
                                    <input
                                      type="text"
                                      className="c-input c-block"
                                      placeholder="First name"
                                      name="firstName"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.firstName}
                                    />
                                  </label>
                                  {errors.firstName && touched.firstName && <span className="c-error">{errors.firstName}</span>}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="c-field">
                                  <label>
                                    Last name
                                <input
                                      type="text"
                                      className="c-input c-block"
                                      placeholder="Last name"
                                      name="lastName"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.lastName}
                                    />
                                  </label>
                                  {errors.lastName && touched.lastName && <span className="c-error">{errors.lastName}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="c-field">
                              <label>
                                Email
                                <input
                                  type="text"
                                  className="c-input c-block"
                                  placeholder="Email"
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
                              If you already have a Constant account <a href={`/login`}>Login</a>
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
