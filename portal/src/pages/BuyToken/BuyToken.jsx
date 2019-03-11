import React from 'react';

import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  CircularProgress,
} from '@material-ui/core';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import Link from '@/components/Link';
// import Logo from '@/assets/logo.svg';
import bgImage from '@/assets/create-a-proposal.svg';


class BuyToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render = () => {
    const {asset = "", amount = ""} = this.state;
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
                    <FormControlLabel value="1" control={<Radio />} label="USD" />
                    <FormControlLabel
                      control={<Radio />}
                      label="ETH"
                      value="2"
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
                  <Button variant="contained" style={{width: "100%"}}>
                    Get DCB Token
                  </Button>
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="c-card card-create-a-proposal-container" style={{ backgroundImage: `url(${bgImage})`, minHeight: 150 }}>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BuyToken;
