import React from 'react';
import { Button } from '@material-ui/core';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="landing-page">
        <div className="container">
          <div className="row page-block block-text">
            <h3>Constant Coin</h3>
            <p>
              Borderless banking requires a borderless currency. Constant is a digital dollar, a stablecoin pegged 1:1 with the USD - designed to blend the best of the existing financial system with the fairness and freedom now possible with blockchain technology. Most importantly, anyone can own Constant, and access the financial solutions it unlocks. Constant is available via local banks as well as international cryptocurrency exchanges.
            </p>
          </div>
          <div className="row page-block block-info">
            {
              [1, 2, 3, 4].map(() => (
                <div className="col-xs-12 col-md-6 col-lg-3">
                  <div className="info">
                    <h6>Title</h6>
                    <p>Borderless banking requires a borderless currency. Constant is a digital dollar, a stablecoin pegged 1:1 with the USD - designed to blend the best of the existing financial system with the</p>
                    <Button variant="contained" color="primary">Action</Button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
