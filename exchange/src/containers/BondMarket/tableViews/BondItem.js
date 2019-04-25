import React from "react";
import PropTypes from "prop-types";
import {ImageCell} from "@ui/tables/helperCells";

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
    const {name, TotalAmount, BuyBackAvailable, BondBuys} = item;
    const firstHistory = BondBuys.length > 0 ? BondBuys[0] : undefined;
    const tokenImage = firstHistory ? firstHistory.TokenImage : undefined;
    return (
      <div className={"wrapperBond " + (this.props.defaultSelected ? "wrapperSelectedBond" : "")}>
        <div
          className="wrapperBondItem"
          onClick={() => this.handleOnSelectBond(name)}
        >
          {tokenImage && <div className="image">{ImageCell(tokenImage)}</div>}
          <div className="detail">
            <div className="historyName">{name}</div>
            <div className="totalAmount">Buy Amount: {TotalAmount}</div>
            <div className="buyBackAvailable">
              Buy Back Available: {BuyBackAvailable}
            </div>
          </div>
        </div>
        <div className="line"/>
      </div>
    );
  }
}
