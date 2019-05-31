import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import cn from '@sindresorhus/class-names';
import { getListCommittee } from '@/reducers/constant/action';
import { formatBlocksHeight } from '@/services/formatter';

class Committees extends React.Component {
  static propTypes = {
    actionGetListCommittee: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      committees: props.committees,
    };
  }

  componentDidMount() {
    const { actionGetListCommittee } = this.props;
    actionGetListCommittee();
  }

  render() {
    const { committees } = this.props;
    if (!committees) {
      return null;
    }

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
                <div className="block-heading" style={{ fontSize: '15px' }}>Beacon Commmitee</div>
                <table
                  className={cn('c-table', {
                    'c-table-list': !isEmpty(committees.BeaconCommittee),
                  })}
                >
                  <tbody>
                  {
                    !isEmpty(committees.BeaconCommittee)
                      ? Object.keys(committees.BeaconCommittee)
                        .map((key, index) => (
                          <tr key={key}>
                            <td>{`#${index + 1}`}</td>
                            <td className="c-hash">{committees.BeaconCommittee[key]}</td>
                          </tr>
                        ))
                      : (
                        <tr>
                          <td style={{ textAlign: 'center' }}>Empty</td>
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
                        <div className="block-heading" style={{ fontSize: '15px' }}>Shard {key} Committee
                        </div>
                        <table
                          className={cn('c-table', {
                            'c-table-list': !isEmpty(shardCommittee),
                          })}
                        >
                          <tbody>
                          {
                            !isEmpty(shardCommittee)
                              ? Object.keys(shardCommittee)
                                .map((key, index) => (
                                  <tr key={key}>
                                    <td>{`#${index + 1}`}</td>
                                    <td className="c-hash">{shardCommittee[key]}</td>
                                  </tr>
                                ))
                              : (
                                <tr>
                                  <td style={{ textAlign: 'center' }}>Empty</td>
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
  }),
  ({
    actionGetListCommittee: getListCommittee,
  }),
)(Committees);
