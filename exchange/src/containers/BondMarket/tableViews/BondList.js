import React, { Component } from "react";
import PropTypes from "prop-types";
import { BondItem } from "./BondItem";

export default class BondList extends Component {
  static propTypes = {
    list: PropTypes.array
  };
  static defaultProps = {
    list: []
  };

  render() {
    const { list, onSelectBond } = this.props;
    return (
      <div className="BondList">
        {list.map((item, index) => (
          <BondItem key={index} item={item} onSelectBond={onSelectBond} />
        ))}
      </div>
    );
  }
}
