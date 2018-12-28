import React, { Component } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './BioInfoMoney.scss';


class BioInfoMoney extends Component {

  static propTypes = {
    item: PropTypes.object,
    primaryColor: PropTypes.string
  }
  static defaultProps = {
    item: {
      symbol: 'CST',
      total: 12556,
      name: 'Available loan'
    }
  }

  render() {
    const { primaryColor, item } = this.props;
    const { symbol, total, name } = item;
    return (
      <div className="wrapperBioMoney">
        <div
          className={`bioSymbol ${primaryColor}`}
        >{symbol}</div>
        <div className={`bioNumber ${primaryColor}`}>{total.toLocaleString()}</div>
        <div className="bioName">{name}</div>
      </div>
    )
  }
}
export default BioInfoMoney;
