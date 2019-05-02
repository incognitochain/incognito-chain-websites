import React from "react";
import PropTypes from "prop-types";
import {ImageCell} from "@ui/tables/helperCells";
import styled from "styled-components";
import {formatHashStr, formatTokenAmount} from "../../../services/Formatter";

export class BondItem extends React.Component {
  constructor() {
    super();
  }

  static propTypes = {
    item: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onSelectBond: PropTypes.func,
  };

  handleOnSelectBond = name => {
    this.props.onSelectBond(name);
  };

  render() {
    const {item} = this.props;
    const {name, TotalAmount, BuyBackAvailable, BondBuys, BondImage, BondSymbol, BondName} = item;
    const bondID = name;
    const firstHistory = BondBuys.length > 0 ? BondBuys[0] : undefined;
    const tokenImage = firstHistory ? firstHistory.TokenImage : undefined;
    return (
      <div className={"wrapperBond " + (this.props.defaultSelected ? "wrapperSelectedBond" : "")}
           onClick={() => this.handleOnSelectBond(name)}>
        <div
          className="wrapperBondItem"
        >
          {tokenImage && <div className="image">{ImageCell(tokenImage)}</div>}
          <div className="detail">
            <Left>
              <img className={"bondImage"} alt={bondID} title={BondSymbol} src={BondImage}/>
            </Left>
            <Right>
              <div className="historyName">{BondName}</div>
              <div className="historyName"><a target="_blank"
                                              href={process.env.explorerUrl + '/token/' + bondID}>{formatHashStr(bondID, true)}</a>
              </div>
              <div className="totalAmount">Buy Amount: {formatTokenAmount(TotalAmount)}</div>
              <div className="buyBackAvailable">
                Buy Back Available: {formatTokenAmount(BuyBackAvailable)}
              </div>
            </Right>
          </div>
        </div>
      </div>
    );
  }
}

const Left = styled.div`
  width: 50px;
  margin-right: 10px;
  float: left;
  img {
    width: 50px;
    height: 50px;
  }
`;

const Right = styled.div`
  flex: 1;
  float: right;
  @media only screen and (max-device-width: 640px) {
    float: left;
  }
`;
