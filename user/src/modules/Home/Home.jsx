import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Link from "components/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight, faEdit } from "@fortawesome/pro-regular-svg-icons";
import bgApplyGOV from "assets/apply-gov.svg";
import bgApplyDCB from "assets/apply-dcb.svg";
import bgApplyMCB from "assets/apply-mcb.svg";
import { axios, catchError } from "services/api";
import { API } from "constants/index";
import cn from "classnames";
import bgImage from "assets/create-a-proposal.svg";
import { Dialog, Textarea, toaster } from "evergreen-ui";
import { checkAuth } from "reducers/auth/action";
import GovProposalDialog from "./GovProposalDialog";
import DcbProposalDialog from "./DcbProposalDialog";
import _ from "lodash";
import { GovTokens } from "../gov-tokens/GovTokens";

import { checkIsUserInBoard } from "../../services/oracle.js";

const CheckInit = ({ children, inited }) => {
  if (!inited) {
    return <div />;
  }
  return children;
};

const Applied = ({ applied, children }) => {
  if (applied) return "Applied";
  return children;
};

class Home extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    authCheckAuth: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { auth } = props;

    this.state = {
      candidate: {},
      inited: false,
      address: "",
      dialogBio: false,
      dialogDCBProposal: false,
      dialogGOVProposal: false,
      isLoading: false,
      bio: auth.data.Bio,
      oldBio: auth.data.Bio,
      dcbParams: {},
      govParams: {},

      isUserInBoard: false,
    };
  }

  componentDidMount() {
    this.loadUserCandidate();
    this.loadGovParams();
    this.loadDcbParams();

    this.onCheckUserIsInBoard();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.data.Bio !== prevState.oldBio) {
      return { bio: nextProps.auth.data.Bio, oldBio: nextProps.auth.data.Bio };
    }
    return null;
  }

  onCheckUserIsInBoard = async () => {
    const res = await checkIsUserInBoard()
    const {result,error} = res;
    if (error) {
      console.log(error);
    }
    if (result || result === true) {
      this.setState({
        isUserInBoard: true,
      })
    }
  }

  loadUserCandidate = () => {
    axios
      .get(API.VOTING_DATA)
      .then(res => {
        const { data } = res;
        if (data) {
          const { Result, Error: resError } = data;
          if (!resError) {
            this.setState({
              candidate: Result || {},
              inited: true
            });
          }
        }
      })
      .catch(e => {
        catchError(e);
      });
  };

  loadGovParams = () => {
    axios
      .get(API.VOTING_GOV_PARAMS)
      .then(res => {
        const { data } = res;
        if (data) {
          const { Result } = data;
          if (Result) {
            const { GOVParams } = Result;
            if (GOVParams) {
              this.setState({ govParams: GOVParams });
            }
          }
        }
      })
      .catch(e => {
        catchError(e);
      });
  };

  loadDcbParams = async () => {
    try {
      const [
        dcbRes,
        sellingAssetOptionsRes,
        buyingAssetOptionRes
      ] = await Promise.all([
        axios.get(API.VOTING_DCB_PARAMS),
        axios.get(
          `${process.env.REACT_APP_SERVICE_API}/voting/proposalsellingassets`
        ),
        axios.get(
          `${process.env.REACT_APP_SERVICE_API}/voting/proposalbuyingassets`
        )
      ]);
      this.setState({
        dcbParams: _.get(dcbRes, "data.Result.DCBParams"),
        sellingAssetOptions: this.getSellingAssetOptions(
          sellingAssetOptionsRes
        ),
        buyingAssetOptions: this.getBuyingAssetOptions(buyingAssetOptionRes)
      });
    } catch (e) {
      toaster.warning("Error on loading DCB Params. Please refresh the page!");
      catchError(e);
    }
  };

  getSellingAssetOptions(response) {
    return Object.entries(_.get(response, "data.Result", [])).map(
      ([key, value]) => ({
        value: value,
        label: key
      })
    );
  }

  getBuyingAssetOptions(response) {
    return Object.entries(_.get(response, "data.Result", [])).map(
      ([key, value]) => ({
        value: value,
        label: key
      })
    );
  }

  submitBio = () => {
    const { bio } = this.state;
    const { authCheckAuth } = this.props;

    if (!bio) {
      toaster.warning("Bio is required");
      this.setState({ isLoading: false });
      return;
    }

    axios
      .put(API.USER_UPDATE, {
        Bio: bio
      })
      .then(res => {
        const { data } = res;
        const { Result } = data;
        if (Result) {
          this.setState({ isLoading: false, dialogBio: false });
          toaster.success("Updated your bio");
          authCheckAuth();
        } else {
          toaster.warning("Error update profile");
        }
      })
      .catch(e => {
        this.setState({ isLoading: false, dialogBio: false });
        toaster.warning("Error update profile");
        catchError(e);
      });
  };

  submitCreateDCB = async (values, setSubmitting) => {
    setSubmitting(true);
    this.setState({ isLoading: true });
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVICE_API + "/voting/proposal",
        {
          Type: 1,
          Name: values.Name,
          DCB: {
            DCBParams: {
              ListSaleData: values.dcbParams.ListSaleData.map(sale => ({
                SaleID: "123456", // TODO - remove SaleID
                EndBlock: parseInt(sale.EndBlock, 10),
                BuyingAsset: sale.BuyingAsset,
                BuyingAmount: parseInt(sale.BuyingAmount, 10),
                SellingAsset: sale.SellingAsset,
                SellingAmount: parseInt(sale.SellingAmount, 10)
              })),
              MinLoanResponseRequire: parseInt(
                values.dcbParams.MinLoanResponseRequire,
                10
              ),
              MinCMBApprovalRequire: parseInt(
                values.dcbParams.MinCMBApprovalRequire,
                10
              ),
              LateWithdrawResponseFine: parseInt(
                values.dcbParams.LateWithdrawResponseFine,
                10
              ),
              SaleDCBTokensByUSDData: {
                Amount: parseInt(
                  values.dcbParams.SaleDCBTokensByUSDData.Amount,
                  10
                ),
                EndBlock: parseInt(
                  values.dcbParams.SaleDCBTokensByUSDData.EndBlock,
                  10
                )
              },
              ListLoanParams: values.dcbParams.ListLoanParams.map(loan => ({
                InterestRate: parseInt(loan.InterestRate, 10),
                Maturity: parseInt(loan.Maturity, 10),
                LiquidationStart: parseInt(loan.LiquidationStart, 10)
              }))
            },
            ExecuteDuration: parseInt(values.ExecuteDuration, 10),
            Explanation: values.Explanation
          }
        }
      );
      if (response.status === 200 && _.get(response, "data.Result")) {
        this.setState({
          dialogDCBProposal: false
        });
      } else {
        toaster.danger("Create DCB Proposal Error. Please try again later!");
      }
    } catch (e) {
      toaster.danger("Create DCB Proposal Error. Please try again later!");
      catchError(e);
    }

    this.setState({ isLoading: false });
  };

  submitCreateGOV = async (values, setSubmitting) => {
    setSubmitting(true);
    this.setState({ isLoading: true });

    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVICE_API + "/voting/proposal",
        {
          Type: 2,
          Name: "abcd",
          GOV: {
            GOVParams: {
              SalaryPerTx: parseInt(values.govParams.SalaryPerTx, 10),
              BasicSalary: parseInt(values.govParams.BasicSalary, 10),
              FeePerKbTx: parseInt(values.govParams.FeePerKbTx, 10),
              SellingBonds: {
                BondName: values.govParams.SellingBonds.BondName,
                BondSymbol: values.govParams.SellingBonds.BondSymbol,
                TotalIssue: parseInt(
                  values.govParams.SellingBonds.TotalIssue,
                  10
                ),
                BondsToSell: parseInt(
                  values.govParams.SellingBonds.BondsToSell,
                  10
                ),
                BondPrice: parseInt(
                  values.govParams.SellingBonds.BondPrice,
                  10
                ),
                Maturity: parseInt(values.govParams.SellingBonds.Maturity, 10),
                BuyBackPrice: parseInt(
                  values.govParams.SellingBonds.BuyBackPrice,
                  10
                ),
                StartSellingAt: parseInt(
                  values.govParams.SellingBonds.StartSellingAt,
                  10
                ),
                SellingWithin: parseInt(
                  values.govParams.SellingBonds.SellingWithin,
                  10
                )
              },
              SellingGOVTokens: {
                TotalIssue: parseInt(
                  values.govParams.SellingGOVTokens.TotalIssue,
                  10
                ),
                GOVTokensToSell: parseInt(
                  values.govParams.SellingGOVTokens.GOVTokensToSell,
                  10
                ),
                GOVTokenPrice: parseInt(
                  values.govParams.SellingGOVTokens.GOVTokenPrice,
                  10
                ),
                StartSellingAt: parseInt(
                  values.govParams.SellingGOVTokens.StartSellingAt,
                  10
                ),
                SellingWithin: parseInt(
                  values.govParams.SellingGOVTokens.SellingWithin,
                  10
                )
              },
              RefundInfo: {
                ThresholdToLargeTx: parseInt(
                  values.govParams.RefundInfo.ThresholdToLargeTx,
                  10
                ),
                RefundAmount: parseInt(
                  values.govParams.RefundInfo.RefundAmount,
                  10
                )
              },
              OracleNetwork: {
                OraclePubKeys: values.govParams.OracleNetwork.OraclePubKeys,
                WrongTimesAllowed: parseInt(
                  values.govParams.OracleNetwork.WrongTimesAllowed,
                  10
                ),
                Quorum: parseInt(values.govParams.OracleNetwork.Quorum, 10),
                AcceptableErrorMargin: parseInt(
                  values.govParams.OracleNetwork.AcceptableErrorMargin,
                  10
                ),
                UpdateFrequency: parseInt(
                  values.govParams.OracleNetwork.UpdateFrequency,
                  10
                ),
                OracleRewardMultiplier: parseInt(
                  values.govParams.OracleNetwork.OracleRewardMultiplier,
                  10
                )
              }
            },
            ExecuteDuration: parseInt(values.ExecuteDuration, 10),
            Explanation: values.Explanation
          }
        }
      );

      if (response.status === 200 && _.get(response, "data.Result")) {
        this.setState({
          dialogGOVProposal: false
        });
      } else {
        toaster.danger("Create GOV Proposal Error. Please try again later!");
      }
    } catch (e) {
      toaster.danger("Create GOV Proposal Error. Please try again later!");
      catchError(e);
    }

    this.setState({ isLoading: false });
  };

  apply = (type, ev, denyCall) => {
    ev.preventDefault();
    const { address } = this.state;

    if (!denyCall) {
      axios
        .post(API.VOTING_APPLY, {
          PaymentAddress: address,
          BoardType: type
        })
        .then(res => {
          const { data } = res;
          if (data) {
            const { Result } = data;
            if (Result) {
              this.loadUserCandidate();
              toaster.success("Apply success!");
            }
          }
        })
        .catch(e => {
          catchError(e);
        });
    }
  };

  render() {
    const {
      inited,
      isLoading,
      dialogBio,
      dialogDCBProposal,
      dialogGOVProposal,
      bio,
      candidate,
      dcbParams,
      govParams,

      isUserInBoard,
    } = this.state;

    const { auth } = this.props;
    return (
      <div className="page user-page home-page">
        <Dialog
          isShown={dialogBio}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscapePress={false}
          title="Edit your bio"
          confirmLabel="Submit"
          isConfirmLoading={isLoading}
          onCloseComplete={() =>
            this.setState({
              dialogBio: false,
              isLoading: false,
              bio: auth.data.Bio
            })
          }
          onConfirm={() => {
            this.setState({ isLoading: true });
            this.submitBio();
          }}
        >
          <div className="withdraw-dialog">
            <div style={{ margin: "0" }}>
              <Textarea
                rows={15}
                label="Your bio"
                placeholder="..."
                autoComplete="off"
                width="100%"
                value={bio}
                onChange={e => {
                  this.setState({ bio: e.target.value });
                }}
              />
            </div>
          </div>
        </Dialog>
        <DcbProposalDialog
          options={{
            sellingAssetOptions: this.state.sellingAssetOptions,
            buyingAssetOptions: this.state.buyingAssetOptions
          }}
          isShown={dialogDCBProposal}
          dcbParams={dcbParams}
          isLoading={isLoading}
          innerRef={form => {
            this.dcbForm = form;
          }}
          onClose={() =>
            this.setState({
              dialogDCBProposal: false,
              isLoading: false
            })
          }
          onConfirm={() => {
            // this.setState({
            //   isLoading: true
            // });
            this.dcbForm.submitForm();
          }}
          submitCreateDCB={this.submitCreateDCB}
        />
        <GovProposalDialog
          innerRef={form => {
            this.govForm = form;
          }}
          isShown={dialogGOVProposal}
          govParams={govParams}
          isLoading={isLoading}
          onClose={() =>
            this.setState({
              dialogGOVProposal: false,
              isLoading: false
            })
          }
          submitCreateGOV={this.submitCreateGOV}
          onConfirm={() => {
            // this.setState({ isLoading: true });
            this.govForm.submitForm();
          }}
        />
        <div className="coin-information">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="c-card">
                  <div className="hello">
                    {`Hello, ${auth.data.FirstName}`}
                    <div
                      className="edit"
                      onClick={() => {
                        this.setState({ dialogBio: true });
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </div>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<p>${auth.data.Bio.replace(
                        /\n{2,}/g,
                        "</p><p>"
                      ).replace(/\n/g, "<br>")}</p>`
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div
                  className="c-card card-create-a-proposal-container"
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  <p>
                    Wanna know how to loan Constant instantly
                    <br />
                    <i>Create new one.</i>
                  </p>
                  <button
                    className="c-btn c-bg-green"
                    type="button"
                    onClick={() => {
                      this.setState({ dialogDCBProposal: true });
                    }}
                  >
                    {"DCB Proposal "}
                    <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                  <button
                    className="c-btn c-bg-green"
                    type="button"
                    onClick={() => {
                      this.setState({ dialogGOVProposal: true });
                    }}
                  >
                    {"GOV Proposal "}
                    <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                  {isUserInBoard ?
                    <Link
                      className="c-btn c-bg-green"
                      to={'/oracle/feed-price'}
                    >
                      {"Oracle Proposal"}
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Link>
                  : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="apply">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-4">
                <div
                  className="c-card"
                  style={{ backgroundImage: `url(${bgApplyGOV})` }}
                >
                  <div className="title c-color-blue-1000">Apply GOV board</div>
                  <div className="description">Control the new internet</div>
                  <CheckInit inited={inited}>
                    <Link
                      className={cn("c-btn", {
                        active: candidate.GOVAppliedAt
                      })}
                      to="/"
                      onClick={e => this.apply(2, e, candidate.GOVAppliedAt)}
                    >
                      <Applied applied={candidate.GOVAppliedAt}>
                        <>
                          {"Apply now "}
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      </Applied>
                    </Link>
                  </CheckInit>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div
                  className="c-card"
                  style={{ backgroundImage: `url(${bgApplyDCB})` }}
                >
                  <div className="title c-color-blue-1000">Apply DCB Board</div>
                  <div className="description">A decentralized bank</div>
                  <CheckInit inited={inited}>
                    <Link
                      className={cn("c-btn", {
                        active: candidate.DCBAppliedAt
                      })}
                      to="/"
                      onClick={e => this.apply(1, e, candidate.DCBAppliedAt)}
                    >
                      <Applied applied={candidate.DCBAppliedAt}>
                        <>
                          {"Apply now "}
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      </Applied>
                    </Link>
                  </CheckInit>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div
                  className="c-card"
                  style={{ backgroundImage: `url(${bgApplyMCB})` }}
                >
                  <div className="title c-color-blue-1000">Apply CMB Board</div>
                  <div className="description">Lorem ipsum ador</div>
                  <CheckInit inited={inited}>
                    <Link
                      disabled={true}
                      className={cn("c-btn", {
                        active: candidate.CMBAppliedAt
                      })}
                      to="/"
                      onClick={e => this.apply(3, e, candidate.CMBAppliedAt)}
                    >
                      <Applied applied={candidate.CMBAppliedAt}>
                        <>
                          {"Comming soon "}
                          <FontAwesomeIcon icon={faArrowRight} />
                        </>
                      </Applied>
                    </Link>
                  </CheckInit>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GovTokens />
      </div>
    );
  }
}

export default connect(
  state => ({ auth: state.auth }),
  {
    authCheckAuth: checkAuth
  }
)(Home);
