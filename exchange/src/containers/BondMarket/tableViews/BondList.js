import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    ImageCell,
   
  } from '@ui/tables/helperCells';

class BondItem extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired,
        onSelectBond: PropTypes.func
    }
    handleOnSelectBond=(name)=> {
        this.props.onSelectBond(name);
    }

    shortName = (str, padChars) => {
        const beginChars = str.slice(0, 10);

        return beginChars.concat(padChars || '...');
      }

    render() {
        const { item } = this.props;
        const { name, TotalAmount, BuyBackAvailable, BondBuys } = item;
        const firstHistory = BondBuys.length > 0 ? BondBuys[0] : undefined;
        const tokenImage = firstHistory ? firstHistory.TokenImage : undefined;
        return (
            <div className="wrapperBond">
                <div className="wrapperBondItem"
                onClick={()=>this.handleOnSelectBond(name)}>
                    {tokenImage && 
                        <div className="image">{ImageCell(tokenImage)}</div>
                    }
                    <div className="detail">
                        <div className="historyName">{this.shortName(name)}</div>
                        <div className="totalAmount">Total: {TotalAmount} BOND</div>
                        <div className="buyBackAvailable">Buy Back Available: {BuyBackAvailable}</div>
                    </div>
                </div>
                <div className="line" />

            </div>
        );
    }
}


export default class BondList extends Component {
    static propTypes = {
        list: PropTypes.array,
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
        const { list, onSelectBond } = this.props;
        return (
            <div className="BondList">
            {list.map((item, index)=>
                <BondItem key={index}
                    item={item}
                    onSelectBond={onSelectBond}
                />
            )}
            </div>
        );
    }
}