import React from 'react';
import {Button} from '@material-ui/core';


let data = [
  {
    title: "Stable unit of account",
    content: "At its very core, Constant is built to maintain a 1:1 peg to the US dollar.  The value of goods and services are easily measured in terms of Constant, which holds its value as the USD does, and is additionally designed to be easily converted at any time.",
  },
  {
    title: "Reliable store of value",
    content: "As far as savings go, Constant provides a viable refuge for multiple volatile economies.  It affords the price stability of the USD with the accessibility of a borderless digital currency.  Unlike many other digital currencies however, Constant straddles both worlds, and easily converts back to fiat.  Each Constant is backed by 1 US dollar, held in a Trust Vault with a strict 100% collateralization."
  },
  {
    title: "Efficient medium of exchange",
    content: "In addition to price stability and the practicalities that affords in any exchange of goods and services, Constant also reduces the friction, distance, expense and inefficiency of every transaction, made by anyone - to anyone - anywhere in the world."
  }
]

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
              The total addressable market of money is about 90 trillion dollars. From its first use in the Tang Dynasty
              (A.D. 618-907), we’ve had more than a thousand years of practice holding and using paper currency. Its
              limitations are keenly felt, now more than ever. With the advent of cryptocurrency - borderless,
              frictionless, and decentralized - the world is beginning to think more broadly about how money should, and
              can, behave.
            </p>
            <p>
              Bitcoin is a powerful cryptocurrency that fails to be the everyday money. Due to its volatility, you
              wouldn’t use Bitcoin, or any coin, to buy a cup of coffee or shop online. No one would accept salaries or
              invoices in Bitcoin, so businesses don’t. As for financial services - offering a loan or taking a deposit
              in an unstable coin is a gamble that few will take. As money, Bitcoin is unusable.
              The total addressable market of money is about 90 trillion dollars. From its first use in the Tang Dynasty
              (A.D. 618-907), we’ve had more than a thousand years of practice holding and using paper currency. Its
              limitations are keenly felt, now more than ever. With the advent of cryptocurrency - borderless,
              frictionless, and decentralized - the world is beginning to think more broadly about how money should, and
              can, behave.
            </p>
            <p>
              Bitcoin is a powerful cryptocurrency that fails to be the everyday money. Due to its volatility, you
              wouldn’t use Bitcoin, or any coin, to buy a cup of coffee or shop online. No one would accept salaries or
              invoices in Bitcoin, so businesses don’t. As for financial services - offering a loan or taking a deposit
              in an unstable coin is a gamble that few will take. As money, Bitcoin is unusable.
            </p>
          </div>
          <div className="row page-block block-info">
            {
              data.map((item) => (
                <div className="col-xs-12 col-md-6 col-lg-3">
                  <div className="info">
                    <h6>{item.title}</h6>
                    <p>{item.content}</p>
                    {/*<Button variant="contained" color="primary">Action</Button>*/}
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
