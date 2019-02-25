import React from "react";
// import PropTypes from 'prop-types';
import { Formik } from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons";
import Link from "components/Link";
import { push } from "connected-react-router";
import { connect } from "react-redux";

class Login extends React.Component {
  static propTypes = {
    // routerPush: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }

  handleSubmit = (values, setSubmitting) => {
    // const { routerPush } = this.props;
    const { email, password } = values;
    const { redirect } = this.state;

    const data = {
      Email: email,
      Password: password
    };

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVICE_API}/auth/login`,
      data
    })
      .then(res => {
        if (res.data && res.data.Result && res.data.Result.Token) {
          Cookies.set("auth", res.data.Result.Token, {
            domain: ".constant.money",
            expires: 30
          });

          if (redirect) {
            document.location.assign(`//${redirect}`);
          } else {
            document.location.assign("/");
          }
        } else {
          this.setState({ error: "Invalid email or password" });
        }
        setSubmitting(false);
      })
      .catch(err => {
        this.setState({ error: "Invalid email or password" });
        console.log("err login", err);
        setSubmitting(false);
      });
  };

  render() {
    const { error } = this.state;

    return (
      <div className="auth-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="auth-form">
                <div className="title">Welcome to Constant</div>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validate={values => {
                    const errors = {};
                    if (!values.email) {
                      errors.email = "Required";
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                      )
                    ) {
                      errors.email = "Invalid email address";
                    }
                    if (!values.password) {
                      errors.password = "Required";
                    }
                    return errors;
                  }}
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                      this.handleSubmit(values, setSubmitting);
                    }, 400);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div
                          className="c-field"
                          style={{ textAlign: "center" }}
                        >
                          <span className="c-error">{error}</span>
                        </div>
                      )}
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
                        {errors.email && touched.email && (
                          <span className="c-error">{errors.email}</span>
                        )}
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
                        {errors.password && touched.password && (
                          <span className="c-error">{errors.password}</span>
                        )}
                      </div>
                      <div className="c-field" style={{ display: "none" }}>
                        Having some trouble?{" "}
                        <a href="/forgot-password">Get help logging in</a>
                      </div>
                      <div className="c-field c-submit">
                        <button
                          className="c-btn c-btn-primary c-block"
                          type="submit"
                        >
                          {isSubmitting ? (
                            <FontAwesomeIcon
                              icon={faSpinnerThird}
                              size="1x"
                              spin
                              style={{ marginRight: 10 }}
                            />
                          ) : (
                            ""
                          )}
                          Login
                        </button>
                      </div>
                      <div className="auth-route">
                        New to Constant?{" "}
                        <Link to="/register">Create an account.</Link>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {
    routerPush: push
  }
)(Login);
