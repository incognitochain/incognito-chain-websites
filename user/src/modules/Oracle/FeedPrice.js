import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import dayjs from 'dayjs';

import {
  TextField,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';

import Link from "components/Link";

import { getAssets, feedPrice } from "../../services/oracle";

const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class FeedPrice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      asset: "",
      assets: [],
      openDialog: false,
      resultMessage: "",
      price: "",
    }
  }
  componentDidMount() {
    this.onGetAssets();
  }
  onChangeAsset = (asset) => {
    this.setState({asset})
  }
  onGetAssets = async () => {
    const res = await getAssets();
    const {result = [],error} = res;
    if (error) {
      console.log(error);
    } else {
      this.setState({assets: result})
    }
  }
  onCloseDialog = () => {
    this.setState({openDialog: false, resultMessage: ""})
  }
  onPriceChange = (price) => {
    this.setState({price})
  }
  onSubmit = async () => {
    const {asset="", price} = this.state;
    if (!asset) return;
    if (!price || isNaN(price)) return;
    this.setState({isSubmitting: true})
    const res = await feedPrice(parseFloat(price), asset);
    const {result, error} = res;
    let resultMessage;
    if (error) {
      console.log(error)
      resultMessage = error;
    }
    if (result || result === true) {
      resultMessage = "Successfully";
    }
    this.setState({resultMessage, openDialog: true, isSubmitting : false})
  }

  render() {
    const {assets=[], openDialog, isSubmitting} = this.state;
    const isDisableBtn = isSubmitting === true;
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="row">
                  <div className="hello">
                    Feed Price
                  </div>
                </div>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}} >
                    <div className="title">ASSETS</div>
                    <Select
                      value={this.state.asset}
                      onChange={(e)=>this.onChangeAsset(e.target.value)}
                      inputProps={{
                        name: 'asset',
                        id: 'asset',
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {assets && assets.length > 0 && assets.map((item={},i) => {
                        return (
                          <MenuItem key={`asset-${i}`} value={item.Asset}>{item.Name}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                  <FormControl component="fieldset" style={{width: "100%"}} >
                    <div className="title">PRICE</div>
                    <TextField
                      id="price"
                      className="input-of-create cst"
                      type="number"
                      style={{
                        lineHeight: "2em",
                      }}
                      fullWidth
                      InputProps={{
                        style: {paddingTop: 10, paddingBottom: 10, height:"inherit !important"},
                      }}
                      onChange={(e)=>this.onPriceChange(e.target.value)}
                      value={this.state.price}
                    />
                  </FormControl>
                </div>
                <br/>
                <div className="row">
                  <FormControl component="fieldset" >
                    <button className="c-btn c-btn-primary submit"  style={{width: "100%"}} disabled={isDisableBtn ? true : false} onClick={this.onSubmit}>
                      Submit
                    </button>
                  </FormControl>
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedPrice)
