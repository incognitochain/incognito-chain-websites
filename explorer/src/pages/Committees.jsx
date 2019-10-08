import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {isEmpty} from 'lodash';
import cn from '@sindresorhus/class-names';
import {
  getListCommittee,
  getListRewardAmount,
  getPrivacyTokens,
  getBeaconBeststateDetail
} from '@/reducers/constant/action';
import {formatBlocksHeight, formatCoinValue} from '@/services/formatter';

class Committees extends React.Component {
  static propTypes = {
    actionGetListCommittee: PropTypes.func.isRequired,
    actionGetListRewardAmount: PropTypes.func.isRequired,
    actionGetPrivacyTokens: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      committees: props.committees,
      commiteesRewardAmount: props.commiteesRewardAmount,
      privacyTokens: props.privacyTokens,
      beaconBeststate: props.beaconBeststate,
    };
  }

  async componentDidMount() {
    const {actionGetListCommittee, actionGetListRewardAmount, actionGetPrivacyTokens, actionGetBeaconBeststate} = this.props;
    await actionGetListCommittee();
    await actionGetListRewardAmount();
    await actionGetPrivacyTokens();
    await actionGetBeaconBeststate();
  }

  render() {
    const {committees, commiteesRewardAmount, privacyTokens, beaconBeststate} = this.props;
    if (!committees || !commiteesRewardAmount || !privacyTokens || !beaconBeststate) {
      return null;
    }

    const PRV = '0000000000000000000000000000000000000000000000000000000000000004'
    var mapPrivacyTokens = {}
    privacyTokens.list.forEach(function (item, i) {
      mapPrivacyTokens[item.ID] = item.Symbol;
    })
    var indexPendingList = 0;

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
                <div className="block-heading">Epoch {formatBlocksHeight(committees.Epoch)} - List Committee</div>
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
                    <th>Mining Key in base58check.encode</th>
                    <th>Reward receiver in base58check.encode</th>
                    <th>PRV Reward</th>
                    <th>Token Reward</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    !isEmpty(committees.BeaconCommittee)
                      ? committees.BeaconCommittee.map((value, index) => (
                        <tr key={value}>
                          <td>{`${index + 1}`}</td>
                          <td className="c-hash">{value}</td>
                          <td className="c-hash">{committees.BeaconRewardReceiver[index]}</td>
                          <td
                            className="c-hash">{formatCoinValue(commiteesRewardAmount[committees.BeaconRewardReceiver[index]] ? commiteesRewardAmount[committees.BeaconRewardReceiver[index]][PRV] / 1e9 : 0)}
                          </td>
                          <td className="c-hash">
                            {
                              Object.keys(mapPrivacyTokens).map((key, i) => {
                                var name = mapPrivacyTokens[key];
                                if (name.length > 0 && commiteesRewardAmount[committees.BeaconRewardReceiver[index]] && commiteesRewardAmount[committees.BeaconRewardReceiver[index]][key]) {
                                  var value = commiteesRewardAmount[committees.BeaconRewardReceiver[index]][key]
                                  if (key == PRV) {
                                    value = value / 1e9;
                                  } else {
                                    value = value / 1e9;
                                  }
                                  return (
                                    <span style={{display: "block"}}>{name + ":" + value}</span>
                                  );
                                } else {
                                  return <></>;
                                }
                              })
                            }
                          </td>
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
                  let shardRewardReceiver = committees.ShardRewardReceiver[key];
                  return (
                    <div className="col-12 col-md-12">
                      <div className="block content">
                        <div className="block-heading" style={{fontSize: '15px'}}>Shard {parseInt(key)} Committee
                        </div>
                        <table
                          className={cn('c-table', {
                            'c-table-list': !isEmpty(shardCommittee),
                          })}
                        >
                          <thead>
                          <tr>
                            <th>#</th>
                            <th>Mining Key in base58check.encode</th>
                            <th>Reward receiver in base58check.encode</th>
                            <th>PRV Reward</th>
                            <th>Token Reward</th>
                          </tr>
                          </thead>
                          <tbody>
                          {
                            !isEmpty(shardCommittee)
                              ? shardCommittee.map((value, index) => (
                                <tr key={key}>
                                  <td>{`${index + 1}`}</td>
                                  <td className="c-hash">{value}</td>
                                  <td className="c-hash">{shardRewardReceiver[index]}</td>
                                  <td
                                    className="c-hash">{formatCoinValue(commiteesRewardAmount[shardRewardReceiver[index]] ? commiteesRewardAmount[shardRewardReceiver[index]][PRV] / 1e9 : 0)}
                                  </td>
                                  <td className="c-hash">
                                    {
                                      Object.keys(mapPrivacyTokens).map((key, i) => {
                                        var name = mapPrivacyTokens[key];
                                        if (name.length > 0 && (commiteesRewardAmount[shardRewardReceiver[index]] && commiteesRewardAmount[shardRewardReceiver[index]][key])) {
                                          var value = commiteesRewardAmount[shardRewardReceiver[index]][key]
                                          if (key == PRV) {
                                            value = value / 1e9;
                                          } else {
                                            value = value / 1e9;
                                          }
                                          return (
                                            <span style={{display: "block"}}>{name + ":" + value}</span>
                                          );
                                        } else {
                                          return <></>;
                                        }
                                      })
                                    }
                                  </td>
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
          <div>
            <hr/>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">Epoch {formatBlocksHeight(committees.Epoch)} - Waiting list</div>
              </div>
            </div>
          </div>
          <div className="row" style={{paddingTop: 20}}>
            <div className="col-12 col-md-12">
              <div className="block content">
                <div className="block-heading" style={{fontSize: '15px'}}>Candidate committee for shard(waiting for next
                  random)
                </div>
                <table class="c-table c-table-list">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Mining Key in base58check.encode</th>
                    <th>Reward receiver in base58check.encode</th>
                    <th>PRV Reward</th>
                    <th>Token Reward</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    beaconBeststate.data.CandidateShardWaitingForNextRandom ? beaconBeststate.data.CandidateShardWaitingForNextRandom.map((value, index) => {
                      return (
                        <tr>
                          <td>{`${index + 1}`}</td>
                          <td className="c-hash">{value.MiningPubKey.bls}</td>
                          <td className="c-hash">{value.IncPubKey}</td>
                          <td
                            className="c-hash">{formatCoinValue(commiteesRewardAmount[value.IncPubKey] ? commiteesRewardAmount[value.IncPubKey][PRV] / 1e9 : 0)}
                          </td>
                          <td className="c-hash">
                            {
                              Object.keys(mapPrivacyTokens).map((key, i) => {
                                var name = mapPrivacyTokens[key];
                                if (name.length > 0 && (commiteesRewardAmount[value.IncPubKey] && commiteesRewardAmount[value.IncPubKey][key])) {
                                  var valueToken = commiteesRewardAmount[value.IncPubKey][key]
                                  if (key == PRV) {
                                    valueToken = valueToken / 1e9;
                                  } else {
                                    valueToken = valueToken / 1e9;
                                  }
                                  return (
                                    <span style={{display: "block"}}>{name + ":" + valueToken}</span>
                                  );
                                } else {
                                  return <></>;
                                }
                              })
                            }
                          </td>
                        </tr>
                      )
                    }) : (
                      <tr>
                        <td style={{textAlign: 'center'}}>Empty</td>
                      </tr>
                    )
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="block content">
                <div className="block-heading" style={{fontSize: '15px'}}>Shard pending validator
                </div>
                <table className="c-table c-table-list">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Shard ID</th>
                    <th>Mining Key in base58check.encode</th>
                    <th>Reward receiver in base58check.encode</th>
                    <th>PRV Reward</th>
                    <th>Token Reward</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    beaconBeststate.data.ShardPendingValidator ? Object.entries(beaconBeststate.data.ShardPendingValidator).map(([shardID, value], index) => {
                      return value.map((v, i) => {
                        indexPendingList++;
                        return (<tr>
                          <td className="c-hash">{`${indexPendingList}`}</td>
                          <td className="c-hash">{shardID}</td>
                          <td className="c-hash">{v.MiningPubKey.bls}</td>
                          <td className="c-hash">{v.IncPubKey}</td>
                          <td
                            className="c-hash">{formatCoinValue(commiteesRewardAmount[v.IncPubKey] ? commiteesRewardAmount[v.IncPubKey][PRV] / 1e9 : 0)}
                          </td>
                          <td className="c-hash">
                            {
                              Object.keys(mapPrivacyTokens).map((key, i) => {
                                var name = mapPrivacyTokens[key];
                                if (name.length > 0 && (commiteesRewardAmount[v.IncPubKey] && commiteesRewardAmount[v.IncPubKey][key])) {
                                  var value = commiteesRewardAmount[v.IncPubKey][key]
                                  if (key == PRV) {
                                    value = value / 1e9;
                                  } else {
                                    value = value / 1e9;
                                  }
                                  return (
                                    <span style={{display: "block"}}>{name + ":" + value}</span>
                                  );
                                } else {
                                  return <></>;
                                }
                              })
                            }
                          </td>
                        </tr>)
                      })

                    }) : (
                      <tr>
                        <td style={{textAlign: 'center'}}>Empty</td>
                      </tr>
                    )
                  }
                  </tbody>
                </table>
              </div>
            </div>
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
    privacyTokens: state.constant.privacyTokens,
    beaconBeststate: state.constant.beaconBeststate,
  }),
  ({
    actionGetListCommittee: getListCommittee,
    actionGetListRewardAmount: getListRewardAmount,
    actionGetPrivacyTokens: getPrivacyTokens,
    actionGetBeaconBeststate: getBeaconBeststateDetail,
  }),
)(Committees);
