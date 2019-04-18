import React from 'react';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; // add
// import RaisedButton from 'material-ui/RaisedButton'; // add
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  CircularProgress,
} from '@material-ui/core';

import {sendSocialURL, getAvailableBalance} from "../../../server/api/faucet";
import {formatConstantValue} from "../../../server/helpers/formatter";
import {getBlockchainInfo} from "../../../server/api/networkInfo";

const inlineStyle = {
  socialItemStyle: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0px 10px 0px",
  },
  socialIconStyle: {
    width: 24,
    height: 24,
    padding: 10,
  }
}

class FaucetHomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      socialURL: "",
      openDialog: false,
      resultMessage: "",
      isSubmitting: false,
      balance: 0,
      blockChainInfo: {}
    }
  }

  componentDidMount() {
    this.onGetBalance();
    this.onGetBlockChainInfo();
    setInterval(this.onGetBlockChainInfo, 3000)
  }

  onGetBlockChainInfo = async () => {
    const res = await getBlockchainInfo();
    if (res.error == "") {
      this.setState({
        blockChainInfo: res.result,
      })
    }
  }

  onChangeSocialURL = (socialURL) => {
    this.setState({socialURL})
  }

  onGetBalance = async () => {
    const res = await getAvailableBalance();
    const {result, error} = res;
    if (error) {
      console.log(error)
      return;
    }
    this.setState({balance: result})
  }

  onSubmit = async () => {
    const {socialURL} = this.state;
    if (!socialURL) return;

    this.setState({isSubmitting: true})
    const res = await sendSocialURL(socialURL);
    const {result, error} = res;
    let resultMessage;
    if (error) {
      console.log(error)
      resultMessage = error;
    }
    if (result || result === true) {
      resultMessage = "Successfully";
      setTimeout(() => {
        window.location.reload();
      }, 200)
    }
    this.setState({resultMessage, openDialog: true, isSubmitting: false})
  }

  onCloseDialog = () => {
    this.setState({openDialog: false, resultMessage: ""})
  }

  getShardBlockHeight = (blockChainInfo) => {
    let height = 0;
    let temp = Object.entries(blockChainInfo.BestBlocks);
    temp.map(([k, v]) => {
      if (k > -1) {
        height += v.Height;
      }
    });
    return height;
  }

  render() {
    const {socialURL = "", openDialog, isSubmitting, balance, blockChainInfo} = this.state;
    const isDisableButton = isSubmitting === true;
    return (
      <div className="App">
        <Grid container>
          <div className="App-header">
            <h2>Constant Authenticated Faucet </h2>
            <div style={{width: '90%', maxWidth: 1280, display: "flex"}}>

              <Input
                type="text"
                fullWidth
                placeholder="Social network URL containing your Constant address"
                disableUnderline
                style={{
                  padding: 5,
                  color: "white",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "",
                  borderTopLeftRadius: 7,
                  borderBottomLeftRadius: 7,
                }}
                onChange={(e) => this.onChangeSocialURL(e.target.value)}
                value={socialURL}
              />

              <Button
                variant="contained"
                onClick={this.onSubmit}
                style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, minWidth: 120}}
                disabled={isDisableButton ? true : false}
              >
                {isSubmitting ?
                  <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress style={{width: 25, height: 25, color: "#e0e0e0"}}/>
                  </div>
                  :
                  <div style={{display: "flex", width: "100%"}}>
                    <div>Give me</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                      <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                  </div>
                }
              </Button>

            </div>

            <div style={{marginTop: 20, textAlign: "left"}}>
              <p>Remain Balance: <strong>{formatConstantValue(balance / 100)}</strong> Constant</p>
              <p>Network: <strong>{blockChainInfo.ChainName ? blockChainInfo.ChainName : ''}</strong></p>
              <p>Beacon: <strong>{blockChainInfo.BestBlocks ? blockChainInfo.BestBlocks[-1].Height : ''}</strong> blocks
              </p>
              <p>Shard: <strong>{blockChainInfo.BestBlocks ? this.getShardBlockHeight(blockChainInfo) : ''}</strong> blocks
              </p>
            </div>

            <div style={{display: "flex", textAlign: "left", justifyContent: "center", marginTop: 30, fontSize: 14}}>

              <Grid item xs={8}>

                <h3>How does this work?</h3>
                <p>This Constant faucet is running on the network. To prevent malicious actors from exhausting all
                  available funds or accumulating enough Constant to mount long running spam attacks, requests are tied
                  to common 3rd party social network accounts. Anyone having a Twitter or Facebook account may request
                  funds within the permitted limits.</p>

                <div style={inlineStyle.socialItemStyle}>
                  <svg style={inlineStyle.socialIconStyle} viewBox="0 0 24 24">
                    <path fill="#fff"
                          d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
                  </svg>

                  <div>
                    To request funds via Twitter, make a <a style={{color: "#bfbfce"}}
                                                            href="https://twitter.com/intent/tweet?text=0x0000000000000000000000000000000000000000."
                                                            target="_about:blank"> tweet</a> with your Constant address
                    pasted into the contents (surrounding text doesn't matter).
                    <br/>Copy-paste the <a style={{color: "#bfbfce"}} href="https://support.twitter.com/articles/80586"
                                           target="_about:blank">tweets URL</a> into the above input box and fire away!
                  </div>
                </div>

                <div style={inlineStyle.socialItemStyle}>
                  <svg style={inlineStyle.socialIconStyle} viewBox="0 0 24 24">
                    <path fill="#fff"
                          d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z"/>
                  </svg>

                  <div>
                    To request funds via Facebook, publish a new <strong>public</strong> post with your Constant address
                    embedded into the content (surrounding text doesn't matter).<br/>Copy-paste the <a
                    style={{color: "#bfbfce"}}
                    href="https://www.facebook.com/help/community/question/?id=282662498552845" target="_about:blank">posts
                    URL</a> into the above input box and fire away!
                  </div>
                </div>


                <p>You can track the current pending requests below the input field to see how much you have to wait
                  until your turn comes.</p>
              </Grid>

            </div>

            <Dialog
              open={openDialog}
              onClose={this.onCloseDialog}
              aria-labelledby="result-dialog-label"
              aria-describedby="result-dialog-description"
            >
              <DialogContent>
                <DialogContentText>
                  {this.state.resultMessage}
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </div>
        </Grid>
      </div>
    )
  }
}

export default FaucetHomePage
