import React, {Component} from "react";
import PropTypes from "prop-types";
import {BondItem} from "./BondItem";

export default class BondList extends Component {
  static propTypes = {
    list: PropTypes.array,
    selectedKey: null,
  };
  static defaultProps = {
    list: []
  };

  render() {
    const {list, onSelectBond, selectedKey} = this.props;
    return (
      <div className="BondList">
        {list && list.length > 0 ? list.map((item, index) =>
          (
            <BondItem key={index} name={item.name} item={item} onSelectBond={onSelectBond}
                      defaultSelected={item.name == selectedKey ? true : false}/>
          )
        ) : "No data"}
      </div>
    );
  }
}
