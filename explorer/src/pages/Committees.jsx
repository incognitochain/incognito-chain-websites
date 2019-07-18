import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {isEmpty} from 'lodash';
import cn from '@sindresorhus/class-names';
import {getListCommittee, getListRewardAmount} from '@/reducers/constant/action';
import {formatBlocksHeight, formatCoinValue} from '@/services/formatter';

class Committees extends React.Component {
  static propTypes = {
    actionGetListCommittee: PropTypes.func.isRequired,
    actionGetListRewardAmount: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      committees: props.committees,
      commiteesRewardAmount: props.commiteesRewardAmount,
    };
  }

  async componentDidMount() {
    const {actionGetListCommittee, actionGetListRewardAmount} = this.props;
    await actionGetListCommittee();
    await actionGetListRewardAmount();
  }

  render() {
    const {committees, commiteesRewardAmount} = this.props;
    if (!committees || !commiteesRewardAmount) {
      return null;
    }
    const PRV = '0000000000000000000000000000000000000000000000000000000000000004'

    return (
      <div className="c-explorer-page c-explorer-page-tx">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li><Link to="/">Explorer</Link></li>
                  <li><Link to="/committees">Committees</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">Epoch {formatBlocksHeight(committees.Epoch)}</div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-12">
              <div className="block content">
                <div className="block-heading" style={{fontSize: '15px'}}>Beacon Commmitee</div>
                <table
                  className={cn('c-table', {
                    'c-table-list': !isEmpty(committees.BeaconCommittee),
                  })}
                >
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Public Key in base58heck.encode</th>
                    <th>PRV Reward</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    !isEmpty(committees.BeaconCommittee)
                      ? committees.BeaconCommittee.map((value, index) => (
                        <tr key={value}>
                          <td>{`${index + 1}`}</td>
                          <td className="c-hash">{value}</td>
                          <td className="c-hash">{formatCoinValue(commiteesRewardAmount[value] ? commiteesRewardAmount[value][PRV] / 1e9 : 0)}</td>
                        </tr>
                      ))
                      : (
                        <tr>
                          <td style={{textAlign: 'center'}}>Empty</td>
                        </tr>
                      )
                  }
                  </tbody>
                </table>
              </div>
            </div>
            {
              Object.keys(committees.ShardCommittee)
                .map((key, index) => {
                  console.log(committees.ShardCommittee[key]);
                  let shardCommittee = committees.ShardCommittee[key];
                  return (
                    <div className="col-12 col-md-12">
                      <div className="block content">
                        <div className="block-heading" style={{fontSize: '15px'}}>Shard {key} Committee
                        </div>
                        <table
                          className={cn('c-table', {
                            'c-table-list': !isEmpty(shardCommittee),
                          })}
                        >
                          <thead>
                          <tr>
                            <th>#</th>
                            <th>Public Key in base58heck.encode</th>
                            <th>PRV Reward</th>
                          </tr>
                          </thead>
                          <tbody>
                          {
                            !isEmpty(shardCommittee)
                              ? shardCommittee.map((value, index) => (
                                <tr key={key}>
                                  <td>{`${index + 1}`}</td>
                                  <td className="c-hash">{value}</td>
                                  <td className="c-hash">{formatCoinValue(commiteesRewardAmount[value] ? commiteesRewardAmount[value][PRV] / 1e9 : 0)}</td>
                                </tr>
                              ))
                              : (
                                <tr>
                                  <td style={{textAlign: 'center'}}>Empty</td>
                                </tr>
                              )
                          }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    );
  }
}


export default connect(
  state => ({
    committees: state.constant.commitees,
    commiteesRewardAmount: state.constant.commiteesRewardAmount,
  }),
  ({
    actionGetListCommittee: getListCommittee,
    actionGetListRewardAmount: getListRewardAmount,
  }),
)(Committees);
