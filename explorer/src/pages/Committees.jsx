import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import cn from '@sindresorhus/class-names';
import { getListCommittee } from '@/reducers/constant/action';

class Committees extends React.Component {
  static propTypes = {
    committees: PropTypes.object.isRequired,
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
            <div className="col-12">
              <div className="block content">
                <div className="block-heading">Committees</div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="block-heading" style={{ fontSize: '15px' }}>Block producers</div>
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
                                <td><Link to={`/chain/${index + 1}`}>{`#${index + 1}`}</Link></td>
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
                  <div className="col-12 col-md-6">
                    <div className="block-heading" style={{ fontSize: '15px' }}>Candidates</div>
                    <table
                      className={cn('c-table', {
                        'c-table-list': !isEmpty(committees.ShardCommittee[0]),
                      })}
                    >
                      <tbody>
                      {
                        !isEmpty(committees.ShardCommittee[0])
                          ? Object.keys(committees.ShardCommittee[0])
                            .map((key, index) => (
                              <tr key={key}>
                                <td>{`#${index + 1}`}</td>
                                <td className="c-hash">{committees.ShardCommittee[0][key]}</td>
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
  }),
  ({
    actionGetListCommittee: getListCommittee,
  }),
)(Committees);
