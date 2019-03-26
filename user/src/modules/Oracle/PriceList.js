import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import dayjs from 'dayjs';

import {
  TextField,
  TablePagination,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core';

import Link from "components/Link";

import { getCurrentPrice } from "../../services/oracle";

const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class PriceList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currenPrice: {},
    }
  }
  componentDidMount() {
    this.onGetCurrentPrice();
  }
  onGetCurrentPrice = async () => {
    const res = await getCurrentPrice();
    const {result = [], error=""} = res;
    if (error) {
      console.log("get current price error", error);
      return;
    }
    this.setState({ currenPrice: result });
  }

  render() {
    const { currenPrice = {} } = this.state;
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="hello" style={{display:"flex", justifyContent: "space-between", alignContent: "center" }}>
                  Current Price List
                </div>

                <List component="nav">
                {currenPrice && Object.keys(currenPrice).length > 0 && Object.keys(currenPrice).map((key,i) => {
                  return (
                    <ListItem button>
                      <ListItemText primary={key.toUpperCase()} />
                      <ListItemIcon>
                      {currenPrice[key]}
                      </ListItemIcon>
                    </ListItem>
                  )
                })}
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceList)
