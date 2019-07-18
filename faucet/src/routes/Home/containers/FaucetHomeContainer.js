import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; // add
// import RaisedButton from 'material-ui/RaisedButton'; // add
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  CircularProgress, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, LinearProgress,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {sendSocialURL, getAvailableBalance, getWaitingList} from "../../../server/api/faucet";
import {formatBlocksHeight, formatConstantValue} from "../../../server/helpers/formatter";
import {getBlockchainInfo, getNetWorkInfo} from "../../../server/api/networkInfo";

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
  },
  logo: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold'
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
      blockChainInfo: {},
      networkInfo: {},
      waitingList: null,
    }
  }

  componentDidMount() {
    this.onGetBalance();
    this.onGetBlockChainInfo();
    this.onGetNetWorkInfo();
    this.onGetWaitingList();
    setInterval(this.onGetBlockChainInfo, 3000)
    setInterval(this.onGetNetWorkInfo, 10000);
    setInterval(this.onGetWaitingList, 1000);
  }

  onGetWaitingList = async () => {
    const resp = await getWaitingList();
    this.setState({
      waitingList: resp.result,
    })
  }

  onGetBlockChainInfo = async () => {
    const res = await getBlockchainInfo();
    if (res.error == "") {
      this.setState({
        blockChainInfo: res.result,
      })
    }
  }

  onGetNetWorkInfo = async () => {
    const res = await getNetWorkInfo();
    if (res.error == "") {
      this.setState({
        networkInfo: res.result,
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
      resultMessage = "Success! You got test PRV.";
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

  renderWaitingList = (waitingList) => {
    if (!waitingList || waitingList.length == 0) {
      return null;
    }
    return waitingList.map((v) => (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography
            className="">{v.PaymentAddress.substring(0, 20) + "..." + v.PaymentAddress.substring(90)}
            <LinearProgress/>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Request at: {v.CreatedAt}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ));
  }

  render() {
    const {socialURL = "", openDialog, isSubmitting, balance, blockChainInfo, networkInfo, waitingList} = this.state;
    const isDisableButton = isSubmitting === true;
    return (
      <div className="App">
        <Grid container>
          <div className="App-header">
            <span style={inlineStyle.logo}>Welcome to the Incognito Faucet.</span>
            <p style={{maxWidth: '500px', margin: '20px 0px'}}>Get some test PRV to play with. Post your wallet address on twitter or facebook, then paste the URL that your post in the field below.</p>
            <div style={{width: '100%', maxWidth: 700, display: "flex"}}>

              <Input
                type="text"
                fullWidth
                placeholder="URL of the post containing your Incognito address"
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
                    <div>Give me privacy</div>
                  </div>
                }
              </Button>

            </div>

            <div className="network-info">
              <p>
                <FontAwesomeIcon icon="heartbeat"/>
                Current Balance: <strong>{formatConstantValue(balance / 1e9)}</strong> PRV</p>
              <p><FontAwesomeIcon
                icon="rss"/>Connection: <strong>{networkInfo.Connections ? networkInfo.Connections : ''}</strong> peers
              </p>
              <p>
                <FontAwesomeIcon
                  icon="network-wired"/>Network: <strong>{blockChainInfo.ChainName ? blockChainInfo.ChainName : ''}</strong>
              </p>
              <p><FontAwesomeIcon
                icon="cubes"/>Beacon: <strong>{blockChainInfo.BestBlocks ? formatBlocksHeight(blockChainInfo.BestBlocks[-1].Height) : ''}</strong> blocks
              </p>
              <p><FontAwesomeIcon
                icon="cubes"/>Shard: <strong>{blockChainInfo.ActiveShards ? formatBlocksHeight(blockChainInfo.ActiveShards) : ''}</strong> shards
                - <strong>{blockChainInfo.BestBlocks ? formatBlocksHeight(this.getShardBlockHeight(blockChainInfo)) : ''}</strong> blocks
              </p>
            </div>
            {
              waitingList && waitingList.length > 0 && (
                <div className="waiting-list">
                  <span>Addresses waiting to receive test PRV</span>
                  {this.renderWaitingList(waitingList)}
                </div>
              )
            }
            <div className="how-to-work">
              <Grid item xs={6}>

                <h3>Why do I need to post my address on social media?</h3>
                <p>Simply because it makes it very difficult for spammers or malicious actors to drain the faucet. You can delete the post after you receive PRV. There's enough Privacy to go round if everyone behaves responsibly.</p>
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
