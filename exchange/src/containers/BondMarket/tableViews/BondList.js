import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BondItem extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        totalAmount: PropTypes.number.isRequired,
        buyBackAvailable: PropTypes.number,
        onSelectBond: PropTypes.func
    }
    handleOnSelectBond=(name)=> {
        this.props.onSelectBond(name);
    }

    render() {
        const { name, totalAmount, buyBackAvailable } = this.props;
        return (
            <div className="wrapperBondItem"
            onClick={()=>this.handleOnSelectBond(name)}>
                <div className="historyName">{name}</div>
                <div className="totalAmount">Total: {totalAmount} CONST</div>
                <div className="buyBackAvailable">Buy Back Available: {buyBackAvailable}</div>
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
                    name = {item.name}
                    totalAmount={item.TotalAmount}
                    buyBackAvailable={item.BuyBackAvailable}
                    onSelectBond={onSelectBond}
                />
            )}
            </div>
        );
    }
}