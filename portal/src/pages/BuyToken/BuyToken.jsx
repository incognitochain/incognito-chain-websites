import React from 'react';

import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import Link from '@/components/Link';
// import Logo from '@/assets/logo.svg';
import bgImage from '@/assets/create-a-proposal.svg';

import {BUYING_ASSET} from '../../constants';
import { buyAsset } from "../../services/reserveAsset";

const BUYING_OBJECT = {
  USD: "usd",
  ETH: "eth",
}

class BuyToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSummitting: false,
      openDialog: false,
      resultMessage: "",
    };
  }

  onAssetChange = (asset) => {
      this.setState({
        asset,
      });
  }
  onAmountChange = (amount) => {
      this.setState({
        amount,
      });
  }

  onSubmit = async () => {
    const {asset, amount} = this.state;
    if (!asset || isNaN(amount) || amount <= 0) {
      return;
    }
    let resultMessage;
    if (asset === BUYING_OBJECT.USD) {
      this.setState({isSummitting: true});
      const result = await buyAsset(BUYING_ASSET.DCB_TOKEN, amount*100);
      this.setState({isSummitting: false});
      const {error=""} = result;
      console.log(result);
      if (error) {
        resultMessage = error;
      } else {
        resultMessage = "Get TOKEN Successful";
      }
    }
    this.setState({resultMessage, openDialog:true})
  }
  onCloseDialog = () => {
    this.setState({openDialog:false, resultMessage: ""});
  }

  render = () => {
    const {asset = "", amount = "", isSummitting, openDialog} = this.state;
    const disableSubmitBtn = (asset === "" || isSummitting);
    return (
      <div className="buytoken-page">
        <div className="container">
          <h5>Reserve Assets</h5>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-8">
              <div className="c-card">
                <FormControl component="fieldset" style={{width: "100%"}} >
                  <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    // className={classes.group}
                    value={asset}
                    onChange={(e)=>this.onAssetChange(e.target.value)}
                    style={{display: 'flex', flexDirection: 'row'}}
                  >
                    <FormControlLabel value={BUYING_OBJECT.USD} control={<Radio />} label="USD" />
                    <FormControlLabel
                      control={<Radio />}
                      label="ETH"
                      value={BUYING_OBJECT.ETH}
                    />
                  </RadioGroup>

                  <TextField
                    id="standard-full-width"
                    // label="Label"
                    type="number"
                    style={{ margin: 8 }}
                    placeholder="Amount"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e)=>this.onAmountChange(e.target.value)}
                    value={amount}
                  />
                  <br/>
                  {
                    isSummitting ?
                      <div style={{display: "flex", justifyContent:"center"}}>
                        <CircularProgress style={{width: "auto", height:"auto"}} />
                      </div>
                    :
                      <Button variant="contained" style={{width: "100%"}} onClick={this.onSubmit} disabled={disableSubmitBtn}>
                        Get DCB Token
                      </Button>
                  }

                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})`, minHeight: 150 }}>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={openDialog}
          onClose={this.onCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText>
              {this.state.resultMessage}
            </DialogContentText>
          </DialogContent>

        </Dialog>
      </div>
    );
  }
}

export default BuyToken;
