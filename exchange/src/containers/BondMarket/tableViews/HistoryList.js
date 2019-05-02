import React, {Component} from "react";
import PropTypes from "prop-types";
import Button from "@ui/uielements/button";

class HistoryItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onBuyBack: PropTypes.func,
    onClickDetail: PropTypes.func
  };
  handleOnBuyBack = () => {
    const {item, onBuyBack} = this.props;
    onBuyBack(item);
  };

  handleOnClickDetai = () => {
    const {item, onClickDetail} = this.props;
    onClickDetail(item);
  };

  renderDetail(item) {
    const {TxID, BuyBackDate, MadeBuyBackDate, Amount, TokenImage} = item;
    const url = `${process.env.explorerUrl}/tx/${TxID}`;
    return (
      <div className="wrapperDetail">
        <div className="TxID">
          <span className="title">TX#</span>
          <a target="_blank" href={url}>
            {TxID}
          </a>
        </div>
        <div className="Amount">
          <span className="title">Amount</span>
          {Amount} CONST
        </div>
        {BuyBackDate && (
          <div className="BuyBackDate">
            <span className="title">Buy Back Date</span>
            {BuyBackDate}
          </div>
        )}
        {MadeBuyBackDate && (
          <div className="BoughtBackAt">
            <span className="title">Bought Back At</span>
            {MadeBuyBackDate}
          </div>
        )}
      </div>
    );
  }

  renderBuyBackButton(item) {
    const {BuyBackAvailable} = item;
    if (!BuyBackAvailable) return false;
    return (
      <Button
        type="primary"
        size="large"
        onClick={() => this.handleOnBuyBack()}
      >
        Buy Back
      </Button>
    );
  }

  render() {
    const {item} = this.props;
    return (
      <div className="wrapperItem">
        <div className="wrapperHistoryItem">
          {this.renderDetail(item)}
          {this.renderBuyBackButton(item)}
        </div>
        <div className="line"/>
      </div>
    );
  }
}

export default class HistoryList extends Component {
  static propTypes = {
    list: PropTypes.array,
    onBuyBack: PropTypes.func
  };
  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {list, onBuyBack, onClickDetail} = this.props;
    return (
      <div className="HistoryList">
        {list && list.length > 0 ? list.map((item, index) => (
          <HistoryItem
            key={index}
            item={item}
            onBuyBack={onBuyBack}
            onClickDetail={onClickDetail}
          />
        )) : "No data"}
      </div>
    );
  }
}
