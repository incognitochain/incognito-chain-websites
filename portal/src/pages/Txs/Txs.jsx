import React from 'react';
import PropTypes from 'prop-types';
import Layout from '@/components/App/Layout';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons';
import Link from '@/components/Link';
import { axios, catchError } from '@/services/api';
import { API } from '@/constants';
// import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

class Transactions extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { match } = this.props;
    const { params } = match;
    const { id: rawId } = params;

    let transactionsLoading = false;

    if (rawId) {
      transactionsLoading = true;
      this.loadTransaction(rawId);
    }

    this.state = {
      borrows: [],
      transactions: [],
      inited: false,
      transactionsLoading,
      id: rawId,
    };

    this.loadBorrows();
  }

  static getDerivedStateFromProps(props, state) {
    const { match } = props;
    const { params } = match;
    const { id } = params;
    if (id !== state.id) {
      return { id, transactionsLoading: true };
    }
    return null;
  }

  componentDidUpdate(props) {
    const { id } = this.state;
    const { match } = props;
    const { params } = match;
    const { id: prevId } = params;
    if (prevId !== id) {
      this.loadTransaction(id);
    }
  }

  loadBorrows = (forLender = false) => {
    let api = API.LOAN_LIST;
    if (forLender) {
      api = API.LOAN_LIST_FOR_LENDER;
    }
    axios.get(api).then((res) => {
      const { data } = res;
      const { Result } = data;
      if (Result && Result.length) {
        let keyName = 'borrows';
        if (forLender) {
          keyName = 'borrowsForLender';
        }
        this.setState({ [keyName]: Result, inited: true });
      }
    }).catch((e) => {
      catchError(e);
      console.log(e);
    });
  }

  loadTransaction = (id) => {
    axios.get(`${API.LOAN_DETAIL}/${id}/transactions`).then((res) => {
      const { data } = res;
      if (data) {
        const { Result } = data;
        if (Result) {
          console.log(Result);
          this.setState({ inited: true, transactions: Result, transactionsLoading: false });
        }
      }
    }).catch((e) => {
      catchError(e);
      this.setState({ inited: true, transactions: [], transactionsLoading: false });
    });
  }

  render() {
    const {
      borrows, transactions, inited, transactionsLoading, id,
    } = this.state;

    if (!inited) {
      return (
        <Layout />
      );
    }

    return (
      <Layout>
        <div className="txs-page">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-4">
                <div className="c-card c-card-no-padding borrows">
                  {borrows.length ? borrows.map(borrow => (
                    <Link to={`/txs/${borrow.LoanID}`} key={borrow.ID} className={`borrow ${id === borrow.LoanID ? 'active' : ''}`}>
                      <div>
                        {'LoanID: '}
                        <span className="tx">
                          {borrow.LoanID}
                        </span>
                      </div>
                      <div>
                        {'Amount: '}
                        {parseFloat(borrow.LoanAmount / 100).numberFormat()}
                        {' CST'}
                      </div>
                    </Link>
                  )) : 'Empty'}
                </div>
              </div>
              <div className="col-12 col-md-8">
                <div className="c-card">
                  <div className="transactions-container">
                    {transactionsLoading ? 'Loading ... ' : ''}
                    {!transactionsLoading && id ? (
                      <Link to={`/loan/${id}`} style={{ marginBottom: 20, display: 'block' }}>
                        {/* <FontAwesomeIcon icon={faAngleLeft} /> */}
                        {' Go to loan detail'}
                      </Link>
                    ) : ''}
                    {!transactionsLoading && transactions.length ? transactions.map(transaction => (
                      <div key={transaction.Hash} className="transaction">
                        <div>
                          {'TX#: '}
                          <a href={`http://explorer.constant.money/tx/${transaction.Hash}`} target="_blank" rel="noopener noreferrer">{transaction.Hash}</a>
                        </div>
                        <div>{`Chain ID: ${transaction.ChainId}`}</div>
                        <div>
                          {'Type: '}
                          <span className={`c-status ${transaction.Type}`}>{transaction.Type}</span>
                        </div>
                      </div>
                    )) : ''}
                    {!id ? 'Please select a specific borrow on sidebar' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Transactions;
