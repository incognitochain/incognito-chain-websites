import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import auth from '../components/auth';
import Cookies from 'js-cookie';

class Index extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
    };
  }

  componentDidMount() {
    if (auth.isLogged()) {
      this.setState({ isLogged: true });
    } else {
      window.location.assign('/login');
    }
  }

  logout = (e) => {
    e.preventDefault();
    Cookies.remove('auth', { domain: '.constant.money', path: '/' });
    window.location.assign('/login');
  }

  render() {
    const { isLogged } = this.state;

    return (
      <div>
        {isLogged ? <a href="/" onClick={this.logout}>Logout</a> : ''}
      </div>
    );
  }
}

export default Index;
