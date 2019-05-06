import React from "react";
import {connect} from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon, CircularProgress,
} from '@material-ui/core';
import {getCurrentPrice} from "../../services/oracle";
import {formatConstantValue} from "../../services/formatter";

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {}
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
    const {accessToken} = this.props;
    const res = await getCurrentPrice(accessToken);
    const {Result = [], Error = ""} = res.data;
    if (Error) {
      console.log("get current price error", Error);
      return;
    }
    this.setState({currenPrice: Result});
  }

  render() {
    const {currenPrice = {}} = this.state;
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="hello"
                     style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                  Current Price List
                </div>
                <List component="nav" style={{textAlign: "center", fontSize: "14px", fontWeight: 500}}>
                  {currenPrice && Object.keys(currenPrice).length > 0 ? Object.keys(currenPrice).map((key, i) => {
                      return (
                        <ListItem button>
                          <ListItemText primary={key.toUpperCase()}/>
                          <ListItemIcon>
                            {`${formatConstantValue(parseFloat(currenPrice[key]) / 100)} USD`}
                          </ListItemIcon>
                        </ListItem>
                      )
                    }) :
                    <CircularProgress/>
                  }
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
