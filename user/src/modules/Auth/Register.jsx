import React from "react";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons";
import Link from "components/Link";
import {connect} from "react-redux";
import { actions as authActions } from "../../actions/auth";


class Register extends React.Component {
  handleSubmit = async (values) => {
    const { register } = this.props;
    const { firstName, lastName, email, newPassword, confirmPassword } = values;

    await register(firstName, lastName, email, newPassword, confirmPassword);
  };

  render() {
    const { error, isLoading } = this.props;

    return (
      <div className="auth-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="auth-form">
                <div className="title">Register</div>
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                  }}
                  validate={values => {
                    const errors = {};
                    if (!values.firstName) {
                      errors.firstName = "Required";
                    }
                    if (!values.lastName) {
                      errors.lastName = "Required";
                    }
                    if (!values.email) {
                      errors.email = "Required";
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                      )
                    ) {
                      errors.email = "Invalid email address";
                    }
                    if (!values.newPassword) {
                      errors.newPassword = "Required";
                    }
                    if (!values.confirmPassword) {
                      errors.confirmPassword = "Required";
                    }
                    if (values.newPassword !== values.confirmPassword) {
                      errors.confirmPassword =
                        "Confirm password does not match";
                    }
                    return errors;
                  }}
                  validateOnBlur={false}
                  validateOnChange={false}
                  onSubmit={(values) => {
                    setTimeout(() => {
                      this.handleSubmit(values);
                    }, 400);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-12">
                          {error && (
                            <div
                              className="c-field"
                              style={{ textAlign: "center" }}
                            >
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
                            {errors.firstName && touched.firstName && (
                              <span className="c-error">
                                {errors.firstName}
                              </span>
                            )}
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
                            {errors.lastName && touched.lastName && (
                              <span className="c-error">{errors.lastName}</span>
                            )}
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
                            name="newPassword"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.newPassword}
                            autoComplete="new-password"
                          />
                          {errors.newPassword && touched.newPassword && (
                            <span className="c-error">
                              {errors.newPassword}
                            </span>
                          )}
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
                        {errors.confirmPassword && touched.confirmPassword && (
                          <span className="c-error">
                            {errors.confirmPassword}
                          </span>
                        )}
                      </div>
                      <div className="c-field c-submit">
                        <button
                          className="c-btn c-btn-primary c-block"
                          type="submit"
                        >
                          {isLoading ? (
                            <FontAwesomeIcon
                              icon={faSpinnerThird}
                              size="1x"
                              spin
                              style={{ marginRight: 10 }}
                            />
                          ) : (
                            ""
                          )}
                          Register
                        </button>
                      </div>
                      <div className="auth-route">
                        If you already have a Constant account{" "}
                        <Link to="/login">Login</Link>
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
  (state) => {
    return {
      isAuthorized: state.auth.isAuthorized,
      isLoading: state.auth.isLoading,
      error: state.auth.registerError,
    }
  },
  {
    register: authActions.register,
  }
)(Register);
