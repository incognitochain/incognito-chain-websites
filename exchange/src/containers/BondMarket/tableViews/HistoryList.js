import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ui/uielements/button';
import { Tooltip } from 'antd';

import {
    ImageCell,
   
  } from '@ui/tables/helperCells';

class HistoryItem extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        onBuyBack: PropTypes.func
    }
    handleOnBuyBack=()=> {
        const { item, onBuyBack } = this.props;
        onBuyBack(item);
    }
    renderDetail(item) {
        const { TxID, TokenID, BuyBackDate,MadeBuyBackDate, Amount, TokenImage } = item;
        return (
            <div className="wrapperDetail">
                <div className="title">
                <Tooltip placement="topLeft" title={TxID}>
                    <span>{ImageCell(TokenImage)}</span>
                </Tooltip>
                </div>
                <div className="detailInfo">
                    <div className="TokenID"><span className="title from">From</span>{TokenID}</div>
                    <div className="Amount"><span className="title">Amount</span>{Amount} CONST</div>
                    {BuyBackDate && <div className="BuyBackDate"><span className="title">Buy Back Date</span>{(new Date(BuyBackDate)).toLocaleString()}</div>}
                    {MadeBuyBackDate && <div className="BoughtBackAt"><span className="title">Bought Back At</span>{(new Date(MadeBuyBackDate)).toLocaleString()}</div>}
                </div>
            </div>
        );
    }
    renderBuyBackButton(item) {
        const { BuyBackAvailable } = item;
        if (!BuyBackAvailable) return false;
        return (
            <Button type="primary" size="large" onClick={()=>this.handleOnBuyBack()}>
            Buy Back
            </Button>
        );
    }
    
    render() {
        const { item } = this.props;
        return (
            <div className="wrapperItem">
                <div className="wrapperHistoryItem">
                    {this.renderDetail(item)}
                    {this.renderBuyBackButton(item)}
                </div>
                <div className="line" />
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
        this.state = {
        } 
    }

    
    
    render(){
        const { list, onBuyBack } = this.props;
        return (
            <div className="HistoryList">
            {list.map((item, index)=>
                <HistoryItem key={index}
                    item={item}
                    onBuyBack={onBuyBack}

                />
            )}
            </div>
        );
    }
}