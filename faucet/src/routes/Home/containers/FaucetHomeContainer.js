import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; // add
// import RaisedButton from 'material-ui/RaisedButton'; // add

class FaucetHomePage extends React.Component {
  render(){
    return (
      <MuiThemeProvider>

      <div className="App">
        <div className="App-header">
          <h2>Welcome to Constant Faucet</h2>
        </div>
      </div>

      </MuiThemeProvider>
    )
  }
}

export default FaucetHomePage
