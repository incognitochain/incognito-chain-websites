import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import cn from '@sindresorhus/class-names';
import { getCommitteeCandidate, getBlockProducer } from '@/reducers/constant/action';

class CommitteeCandidate extends React.Component {
  static propTypes = {
    producers: PropTypes.object.isRequired,
    candidates: PropTypes.object.isRequired,
    actionGetBlockProducer: PropTypes.func.isRequired,
    actionGetCommitteeCandidate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      producers: props.producers,
      candidates: props.candidates,
    };
  }

  componentDidMount() {
    const { actionGetBlockProducer, actionGetCommitteeCandidate } = this.props;
    actionGetBlockProducer();
    actionGetCommitteeCandidate();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.producers.updatedAt !== prevState.producers.updatedAt) {
      return { producers: nextProps.producers };
    }
    if (nextProps.candidates.updatedAt !== prevState.candidates.updatedAt) {
      return { candidates: nextProps.candidates };
    }
    return null;
  }

  render() {
    const { candidates, producers } = this.state;

    if (isEmpty(producers.list)) return null;

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
                        'c-table-list': !isEmpty(producers.list),
                      })}
                    >
                      <tbody>
                        {
                          !isEmpty(producers.list)
                            ? Object.keys(producers.list).map((key, index) => (
                              <tr key={key}>
                                <td><Link to={`/chain/${index + 1}`}>{`#${index + 1}`}</Link></td>
                                <td className="c-hash">{producers.list[key]}</td>
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
                        'c-table-list': !isEmpty(candidates.list),
                      })}
                    >
                      <tbody>
                        {
                          !isEmpty(candidates.list)
                            ? Object.keys(candidates.list).map((key, index) => (
                              <tr key={key}>
                                <td>{`#${index + 1}`}</td>
                                <td className="c-hash">{candidates.list[key]}</td>
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
    producers: state.constant.producers,
    candidates: state.constant.candidates,
  }),
  ({
    actionGetBlockProducer: getBlockProducer,
    actionGetCommitteeCandidate: getCommitteeCandidate,
  }),
)(CommitteeCandidate);
