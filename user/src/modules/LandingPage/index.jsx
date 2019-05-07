import React from "react";

class LandingPage extends React.Component {
  render() {
    return (
      <div className="page user-page landing-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="hello"
                     style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                  Home
                </div>
                <p>Comming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
