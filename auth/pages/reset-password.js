import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Formik } from 'formik';
import env from '💯/.env.js';
import LoadingPage from '@/components/LoadingPage';
import { authPagesCombo } from '@/services/auth.js';
import '@/auth.scss';

const title = 'Account - reset password - Constant: untraceable, constant, digital cash.';
const description = 'Reset password - Account dashboard of constant.money';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inited: false, error: '' };
  }

  componentDidMount() {
    authPagesCombo(this.setState.bind(this));
  }

  render() {
    const { inited, error } = this.state;
    if (!inited) return <LoadingPage />;

    return (
      <>
        <Head title="" description="" />
        <Header hideAuthMenu={true} />
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
                      <a href="/login">Login</a> | <a href="/register">Register</a>
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

export default ResetPassword;
