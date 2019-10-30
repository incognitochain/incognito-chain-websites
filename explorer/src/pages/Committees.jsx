import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { isEmpty } from 'lodash';
import cn from '@sindresorhus/class-names';
import {
  getListCommittee,
  getListRewardAmount,
  getPrivacyTokens,
  getBeaconBeststateDetail,
  getProducersBlacklistDetail
} from '@/reducers/constant/action';
import {
  formatBlocksHeight,
  formatCoinValue,
  formatHashStr
} from '@/services/formatter';

class Committees extends React.Component {
  static propTypes = {
    actionGetListCommittee: PropTypes.func.isRequired,
    actionGetListRewardAmount: PropTypes.func.isRequired,
    actionGetPrivacyTokens: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      committees: props.committees,
      commiteesRewardAmount: props.commiteesRewardAmount,
      privacyTokens: props.privacyTokens,
      beaconBeststate: props.beaconBeststate,
      producersBlacklistDetail: props.producersBlacklistDetail
    };
  }

  async componentDidMount() {
    const {
      actionGetListCommittee,
      actionGetListRewardAmount,
      actionGetPrivacyTokens,
      actionGetBeaconBeststate,
      actionGetProducersBlacklistDetail
    } = this.props;
    await actionGetListCommittee();
    await actionGetListRewardAmount();
    await actionGetPrivacyTokens();
    const beaconBestState = await actionGetBeaconBeststate();
    if (
      beaconBestState &&
      beaconBestState.data &&
      beaconBestState.data.Result
    ) {
      await actionGetProducersBlacklistDetail(
        beaconBestState.data.Result.BeaconHeight
      );
    }
  }

  render() {
    const {
      committees,
      commiteesRewardAmount,
      privacyTokens,
      beaconBeststate,
      producersBlacklistDetail
    } = this.props;
    if (
      !committees ||
      !commiteesRewardAmount ||
      !privacyTokens ||
      !beaconBeststate ||
      !producersBlacklistDetail
    ) {
      return null;
    }
    const PRV =
      '0000000000000000000000000000000000000000000000000000000000000004';
    var mapPrivacyTokens = {};
    privacyTokens.list.forEach(function(item, i) {
      mapPrivacyTokens[item.ID] = item.Symbol;
    });
    var indexPendingList = 0;

    return (
      <div className="c-explorer-page c-explorer-page-tx">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="c-breadcrumb">
                <ul>
                  <li>
                    <NavLink exact activeClassName="nav-active" to="/">
                      Explorer
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      exact
                      activeClassName="nav-active"
                      to="/committees"
                    >
                      Committees
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="heading">
                Epoch {formatBlocksHeight(committees.Epoch)} - Committee Lists
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-12">
              <div className="block content">
                <div className="block-heading" style={{ fontSize: '15px' }}>
                  Beacon Commmitee
                </div>
                <table
                  className={cn('c-table', {
                    'c-table-list': !isEmpty(committees.BeaconCommittee)
                  })}
                >
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Mining Key in base58check.encode</th>
                      <th>Reward Receiver in base58check.encode</th>
                      <th>Reward (PRV)</th>
                      <th>Reward (pToken)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isEmpty(committees.BeaconCommittee) ? (
                      committees.BeaconCommittee.map((value, index) => (
                        <tr key={value}>
                          <td>{`${index + 1}`}</td>
                          <td>{formatHashStr(value, true)}</td>
                          <td>{committees.BeaconRewardReceiver[index]}</td>
                          <td>
                            {formatCoinValue(
                              commiteesRewardAmount[
                                committees.BeaconRewardReceiver[index]
                              ]
                                ? commiteesRewardAmount[
                                    committees.BeaconRewardReceiver[index]
                                  ][PRV] / 1e9
                                : 0
                            )}
                          </td>
                          <td>
                            {Object.keys(mapPrivacyTokens).map((key, i) => {
                              var name = mapPrivacyTokens[key];
                              if (
                                name.length > 0 &&
                                commiteesRewardAmount[
                                  committees.BeaconRewardReceiver[index]
                                ] &&
                                commiteesRewardAmount[
                                  committees.BeaconRewardReceiver[index]
                                ][key]
                              ) {
                                var value =
                                  commiteesRewardAmount[
                                    committees.BeaconRewardReceiver[index]
                                  ][key];
                                if (key == PRV) {
                                  value = value / 1e9;
                                } else {
                                  value = value / 1e9;
                                }
                                return (
                                  <span style={{ display: 'block' }}>
                                    {name + ':' + value}
                                  </span>
                                );
                              } else {
                                return <></>;
                              }
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={5}>
                          - Nothing here at the moment. -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {Object.keys(committees.ShardCommittee).map((key, index) => {
              console.log(committees.ShardCommittee[key]);
              let shardCommittee = committees.ShardCommittee[key];
              let shardRewardReceiver = committees.ShardRewardReceiver[key];
              return (
                <div className="col-12 col-md-12">
                  <div className="block content">
                    <div className="block-heading" style={{ fontSize: '15px' }}>
                      Shard {parseInt(key)} Committee
                    </div>
                    <table
                      className={cn('c-table', {
                        'c-table-list': !isEmpty(shardCommittee)
                      })}
                    >
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Mining Key in base58check.encode</th>
                          <th>Reward Receiver in base58check.encode</th>
                          <th>Reward (PRV)</th>
                          <th>Reward (pToken)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!isEmpty(shardCommittee) ? (
                          shardCommittee.map((value, index) => (
                            <tr key={key}>
                              <td>{`${index + 1}`}</td>
                              <td>{formatHashStr(value, true)}</td>
                              <td>{shardRewardReceiver[index]}</td>
                              <td>
                                {formatCoinValue(
                                  commiteesRewardAmount[
                                    shardRewardReceiver[index]
                                  ]
                                    ? commiteesRewardAmount[
                                        shardRewardReceiver[index]
                                      ][PRV] / 1e9
                                    : 0
                                )}
                              </td>
                              <td>
                                {Object.keys(mapPrivacyTokens).map((key, i) => {
                                  var name = mapPrivacyTokens[key];
                                  if (
                                    name.length > 0 &&
                                    (commiteesRewardAmount[
                                      shardRewardReceiver[index]
                                    ] &&
                                      commiteesRewardAmount[
                                        shardRewardReceiver[index]
                                      ][key])
                                  ) {
                                    var value =
                                      commiteesRewardAmount[
                                        shardRewardReceiver[index]
                                      ][key];
                                    if (key == PRV) {
                                      value = value / 1e9;
                                    } else {
                                      value = value / 1e9;
                                    }
                                    return (
                                      <span style={{ display: 'block' }}>
                                        {name + ':' + value}
                                      </span>
                                    );
                                  } else {
                                    return <></>;
                                  }
                                })}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td style={{ textAlign: 'center' }} colSpan={5}>
                              - Nothing here at the moment. -
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <hr />
          </div>
          <div className="row">
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">
                  Epoch {formatBlocksHeight(committees.Epoch)} - Waiting list
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ paddingTop: 20 }}>
            <div className="col-12 col-md-12">
              <div className="block content">
                <div className="block-heading" style={{ fontSize: '15px' }}>
                  Committee candidates for the next shard (to be selected at
                  random)
                </div>
                <table className="c-table c-table-list">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Mining Key in base58check.encode</th>
                      <th>Reward Receiver in base58check.encode</th>
                      <th>Reward (PRV)</th>
                      <th>Reward (pToken)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beaconBeststate.data.CandidateShardWaitingForNextRandom ? (
                      beaconBeststate.data.CandidateShardWaitingForNextRandom.map(
                        (value, index) => {
                          return (
                            <tr>
                              <td>{`${index + 1}`}</td>
                              <td>{value.MiningPubKey.bls}</td>
                              <td>{value.IncPubKey}</td>
                              <td>
                                {formatCoinValue(
                                  commiteesRewardAmount[value.IncPubKey]
                                    ? commiteesRewardAmount[value.IncPubKey][
                                        PRV
                                      ] / 1e9
                                    : 0
                                )}
                              </td>
                              <td>
                                {Object.keys(mapPrivacyTokens).map((key, i) => {
                                  var name = mapPrivacyTokens[key];
                                  if (
                                    name.length > 0 &&
                                    (commiteesRewardAmount[value.IncPubKey] &&
                                      commiteesRewardAmount[value.IncPubKey][
                                        key
                                      ])
                                  ) {
                                    var valueToken =
                                      commiteesRewardAmount[value.IncPubKey][
                                        key
                                      ];
                                    if (key == PRV) {
                                      valueToken = valueToken / 1e9;
                                    } else {
                                      valueToken = valueToken / 1e9;
                                    }
                                    return (
                                      <span style={{ display: 'block' }}>
                                        {name + ':' + valueToken}
                                      </span>
                                    );
                                  } else {
                                    return <></>;
                                  }
                                })}
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={5}>
                          - Nothing here at the moment. -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="block content">
                <div className="block-heading" style={{ fontSize: '15px' }}>
                  Selected candidates (validators) in preparation phase
                </div>
                <table className="c-table c-table-list">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Shard ID</th>
                      <th>Mining Key in base58check.encode</th>
                      <th>Reward Receiver in base58check.encode</th>
                      <th>Reward (PRV)</th>
                      <th>Reward (pToken)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beaconBeststate.data.ShardPendingValidator ? (
                      Object.entries(
                        beaconBeststate.data.ShardPendingValidator
                      ).map(([shardID, value], index) => {
                        return value.map((v, i) => {
                          indexPendingList++;
                          return (
                            <tr>
                              <td>{`${indexPendingList}`}</td>
                              <td>{shardID}</td>
                              <td>{v.MiningPubKey.bls}</td>
                              <td>{v.IncPubKey}</td>
                              <td>
                                {formatCoinValue(
                                  commiteesRewardAmount[v.IncPubKey]
                                    ? commiteesRewardAmount[v.IncPubKey][PRV] /
                                        1e9
                                    : 0
                                )}
                              </td>
                              <td>
                                {Object.keys(mapPrivacyTokens).map((key, i) => {
                                  var name = mapPrivacyTokens[key];
                                  if (
                                    name.length > 0 &&
                                    (commiteesRewardAmount[v.IncPubKey] &&
                                      commiteesRewardAmount[v.IncPubKey][key])
                                  ) {
                                    var value =
                                      commiteesRewardAmount[v.IncPubKey][key];
                                    if (key == PRV) {
                                      value = value / 1e9;
                                    } else {
                                      value = value / 1e9;
                                    }
                                    return (
                                      <span style={{ display: 'block' }}>
                                        {name + ':' + value}
                                      </span>
                                    );
                                  } else {
                                    return <></>;
                                  }
                                })}
                              </td>
                            </tr>
                          );
                        });
                      })
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={6}>
                          - Nothing here at the moment. -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-12">
              <div className="block content">
                <div className="block-heading" style={{ fontSize: '15px' }}>
                  Greylist
                </div>
                <table className="c-table c-table-list">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Mining Key in base58check.encode</th>
                      <th>Reward Receiver in base58check.encode</th>
                      <th>Count down in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {producersBlacklistDetail.data ? (
                      producersBlacklistDetail.data.map((value, index) => {
                        return (
                          <tr>
                            <td>{`${index + 1}`}</td>
                            <td>{value.MiningPubKey.bls}</td>
                            <td>{value.IncPubKey}</td>
                            <td>{value.Epochs} epoch</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={4}>
                          - Nothing here at the moment. -
                        </td>
                      </tr>
                    )}
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
    producersBlacklistDetail: state.constant.producersBlacklistDetail
  }),
  {
    actionGetListCommittee: getListCommittee,
    actionGetListRewardAmount: getListRewardAmount,
    actionGetPrivacyTokens: getPrivacyTokens,
    actionGetBeaconBeststate: getBeaconBeststateDetail,
    actionGetProducersBlacklistDetail: getProducersBlacklistDetail
  }
)(Committees);
