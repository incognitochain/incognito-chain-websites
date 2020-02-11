import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {formatBlocksHeight} from '@/services/formatter';
import {showDialog} from '@/reducers/app/action';
import {getBlockchainInfo} from '@/reducers/constant/action';
import RootHeader from './RootHeader';
import BlockIcon from '@/assets/icon/home-top-block.svg';
import TxIcon from '@/assets/icon/home-top-tx.svg';
import EpochIcon from '@/assets/icon/home-top-epoch.svg';
import ShardIcon from '@/assets/icon/home-top-shard.svg';
import NetworkIcon from '@/assets/icon/home-top-network.svg';

class Header extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    const chainInfo = this.props;
    this.state = {chainInfo};

    const {actionGetBlockChainInfo} = this.props;
    actionGetBlockChainInfo();
    setInterval(actionGetBlockChainInfo, 15 * 1000);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.chainInfo.updatedAt !== prevState.chainInfo.updatedAt) {
      return {chainInfo: nextProps.chainInfo};
    }
  }

  render() {
    const {chainInfo} = this.state;
    if (!chainInfo.ChainName) {
      return null;
    }
    const bestBlocks = chainInfo.BestBlocks;
    const activeShards = chainInfo.ActiveShards;

    const epoch = bestBlocks[-1].Epoch;
    const remainingBlockepoch = bestBlocks[-1].RemainingBlockEpoch;
    const epochBlock = bestBlocks[-1].EpochBlock;

    const totalTxs = Object.keys(bestBlocks).reduce(
      (accumulator, blockIndex) =>
        parseInt(accumulator, 10) +
        parseInt(bestBlocks[blockIndex].TotalTxs, 10),
      0
    );

    const totalBlocks = Object.keys(bestBlocks).reduce(
      (accumulator, blockIndex) =>
        parseInt(accumulator, 10) + parseInt(bestBlocks[blockIndex].Height, 10),
      0
    );

    return (
      <>
        <RootHeader/>
        <div className="home-top-info-container">
          <div className="container">
            <ul className="home-top-info c-list-inline">
              <li>
                <Link to="/">
                  <img className="icon" src={NetworkIcon}/>
                  <div>
                    <div className="data c-color-black">
                      {chainInfo.ChainName}
                    </div>
                    <div className="title">Network</div>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/chains">
                  <img className="icon" src={ShardIcon}/>
                  <div>
                    <div className="title">Total shards</div>
                    <div className="data c-color-black">{activeShards}</div>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/chain/0">
                  <img className="icon" src={BlockIcon}/>
                  <div>
                    <div className="title">Total blocks</div>
                    <div className="data c-color-black">
                      {formatBlocksHeight(totalBlocks)}
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/txs/pending">
                  <img className="icon" src={TxIcon}/>
                  <div>
                    <div className="title">Total txs</div>
                    <div className="data c-color-black">
                      {formatBlocksHeight(totalTxs)}
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/committees">
                  <img className="icon" src={EpochIcon}/>
                  <div>
                    <div className="title">Epoch</div>
                    <div className="data c-color-black">
                      {formatBlocksHeight(epoch)}
                    </div>
                    <div className="data c-color-black" style={{fontSize: 15}}>
                      Remaining {formatBlocksHeight(remainingBlockepoch)}/{formatBlocksHeight(epochBlock)} blocks
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  state => ({
    chainInfo: state.constant.chainInfo,
    auth: state.auth
  }),
  dispatch => ({
    actionGetBlockChainInfo: () => dispatch(getBlockchainInfo()),
    appShowDialog: showDialog,
    dispatch
  })
)(Header);
