import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

class Home extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const auth = Cookies.get('auth');
    this.state = {
      auth,
    };
  }

  componentDidMount() {
    const { auth } = this.state;
    if (!auth) {
      window.location.assign('http://auth.constant.money/login');
    }
  }

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-8">
              <div className="top-block c-card">

              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="c-card">
                <div className="desc">
                  Wanna join the
                  Constant network -
                  the new era of internet?
                </div>
                <button className="c-btn c-btn-success" type="button">Create a proposal</button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-4">
              <div className="c-card">
                <div className="title">Apply GOV board</div>
                <div className="desc">Control the new internet</div>
                <button className="c-btn c-btn-primary" type="button">Apply now</button>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="c-card">
                <div className="title">Apply DCB Board</div>
                <div className="desc">A decentralized bank</div>
                <button className="c-btn c-btn-primary" type="button">Apply now</button>
              </div>
            </div>
            <div className="col-12 col-sm-4">
              <div className="c-card">
                <div className="title">Apply MCB Board</div>
                <div className="desc">Lorem ipsum ador</div>
                <button className="c-btn c-btn-primary" type="button">Apply now</button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="c-card">
                <table>
                  <tbody>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
