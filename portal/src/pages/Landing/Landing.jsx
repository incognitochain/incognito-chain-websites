import React from 'react';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    window.location.href = "/loan";
    return;
    return (
      <div className="landing-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="content">Landing page</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
