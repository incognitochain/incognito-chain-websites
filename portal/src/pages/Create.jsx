import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Input, {InputGroup, Textarea} from '@ui/uielements/input';

class ComponentName extends React.Component {
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
      <div className="create">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="create-hero">
                <h2>Constant loans backed by your crypto assets</h2>
                <p>Use your crypto to get Constant without selling</p>
              </div>
            </div>
            <div className="col-12">
              <div className="create-box">
                <h2>Create a loan request</h2>
                <div className="row">
                  <div className="col-12 col-md-4">
                    <h3>CHOOSE YOUR COLLATERAL</h3>
                    <input type="text" className="c-input c-block"/>
                  </div>
                  <div className="col-12 col-md-4">
                    <h3>ENTER LOAN AMOUNT</h3>
                    <input type="text" className="c-input c-block"/>
                  </div>
                  <div className="col-12 col-md-4">
                    <h3>COLLATERAL AMOUNT</h3>
                    <input type="text" className="c-input c-block"/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-4">
                    <label>
                      START DATE
                      <input type="text" className="c-input c-block"/>
                    </label>
                  </div>
                  <div className="col-12 col-md-4">
                    <label>
                      END DATE
                      <input type="text" className="c-input c-block"/>
                    </label>
                  </div>
                  <div className="col-12 col-md-4">
                    <label>
                      INTEREST RATE
                      <input type="text" className="c-input c-block"/>
                    </label>
                  </div>
                </div>
                <p>
                  I certify that I am 18 years of age or older,
                  and I agree to the Terms & Conditions.
                </p>
                <button className="c-btn c-btn-primary" type="button">Summit</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default ComponentName;
