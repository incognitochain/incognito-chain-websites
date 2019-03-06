import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBlockchainInfo } from '@/reducers/constant/action';
import { Link } from 'react-router-dom';

class Chains extends React.Component {
  static propTypes = {
    actionGetBlockChainInfo: PropTypes.func.isRequired,
    chainInfo: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { chainInfo } = this.props;

    this.state = {
      chainInfo,
    };

    this.loadData();
    setInterval(this.loadData, 5000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return { chainInfo: nextProps.chainInfo };
    }
    return null;
  }

  loadData = () => {
    const { actionGetBlockChainInfo } = this.props;
    actionGetBlockChainInfo();
  };

  render() {
    const { chainInfo } = this.state;
    if (!chainInfo.ChainName) {
      return null;
    }
    const bestBlocks = chainInfo.BestBlocks;

    return (
      <div className="c-explorer-page c-explorer-page-chains">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/chains">Shard list</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block"><h3 className="block-heading">Shard list</h3></div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {Object.keys(bestBlocks)
              .map((key) => {
                if (key == -1) {
                  return (<></>);
                }
                let index = parseInt(key);
                let block = bestBlocks[key];
                return (
                  <div className="col-12 col-sm-6 col-md-6 chain-item" key={block.Hash}>
                    <Link to={`/chain/${index + 1}`} className="card">
                      <strong className="chain-id">{`Shard #${index + 1}`}</strong>
                      <div className="chain-item-content">
                        <div>{`Height: ${block.Height.toLocaleString(navigator.language, { minimumFractionDigits: 0 })}`}</div>
                        <div className="c-hash">{`Best block: ${block.Hash.substr(0, 50)}`}...</div>
                        <div>{`Total txs: ${block.TotalTxs.toLocaleString(navigator.language, { minimumFractionDigits: 0 })}`}</div>
                        <div>{`Salary fund: ${(block.SalaryFund / 100).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}`} Const</div>
                        <div>{`Salary per TX: ${(block.SalaryPerTx).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}`} Const</div>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    chainInfo: state.constant.chainInfo,
  }),
  ({
    actionGetBlockChainInfo: getBlockchainInfo,
  }),
)(Chains);
