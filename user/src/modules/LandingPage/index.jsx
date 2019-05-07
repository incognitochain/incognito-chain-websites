import React from "react";

class LandingPage extends React.Component {
  render() {
    return (
      <div className="page user-page landing-page">
        <div className="container">
          <div className="row">
            <div className="col-md-6" style={{textAlign: "right", paddingRight: "25px"}}>
              <img src="https://www.myconstant.com/public/assets/left_banner_1-8f8c5c18.svg"></img>
            </div>
            <div className="col-md-6" style={{paddingRight: "15%", paddingLeght: "25px"}}>
              <h2>The world’s first fully secured peer-to-peer lending platform.</h2>
              <p style={{padding: "20px 0", textAlign: "justify"}}>Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
                Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12" style={{padding: "0"}}>
              <p style={{padding: "30px 25%", margin: "30px 0", backgroundColor: "#fafafa"}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12" style={{textAlign: "center"}}>
              <h2>How It Work.</h2>
              <p style={{padding: "20px 30%"}}>Investors make deposit of any amount, and choose the interest rate they
                want to earn. Borrowers
                choose how much interest they want to pay, and put down collateral equal to 150% of what they want to
                borrow. A matching algorithm connects them, and smart contract technology automates the entire
                process.</p>
              <p>
                <img src={"https://www.myconstant.com/public/assets/howItWorks-60af4c0f.svg"}/>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 footer">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
