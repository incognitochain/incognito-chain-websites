import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBlockchainInfo } from '@/reducers/constant/action';
import { Link } from 'react-router-dom';

class Chains extends React.Component {
  static propTypes = {
    actionGetBlockChainInfo: PropTypes.func.isRequired,
    chainInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { chainInfo } = this.props;

    this.state = {
      chainInfo,
    };

    const { actionGetBlockChainInfo } = this.props;
    actionGetBlockChainInfo();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return { chainInfo: nextProps.chainInfo };
    }
    return null;
  }

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
                  <li><Link to="/chains">Chain list</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-12">
              <div className="block"><h3 className="block-heading">Chain list</h3></div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {Object.values(bestBlocks).map((block, index) => (
              <div className="col-12 col-sm-6 col-md-3 chain-item" key={block.Hash}>
                <Link to={`/chain/${index + 1}`} className="card">
                  <strong className="chain-id">{`Chain #${index + 1}`}</strong>
                  <div className="chain-item-content">
                    <div>{`Height: ${block.Height}`}</div>
                    <div className="c-hash">{`Best block: ${block.Hash.substr(0, 5)}`}</div>
                    <div>{`Total txs: ${block.TotalTxs}`}</div>
                    {/* <div>{`Salary fund: ${block.SalaryFund}`}</div> */}
                    <div>{`Salary per TX: ${block.SalaryPerTx}`}</div>
                  </div>
                </Link>
              </div>
            ))}
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
