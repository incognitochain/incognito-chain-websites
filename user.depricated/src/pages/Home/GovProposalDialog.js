import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, TextInputField } from "evergreen-ui";
import _ from "lodash";
import { Formik, FieldArray, Field } from "formik";
import { faMinus, faPlus } from "@fortawesome/pro-regular-svg-icons";
import styled from "styled-components";

export default function GovProposalDialog({
  isShown,
  govParams,
  isLoading,
  onClose,
  onConfirm,
  innerRef,
  submitCreateGOV
}) {
  return (
    <Dialog
      preventBodyScrolling
      isShown={isShown}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEscapePress={false}
      title="Create a GOV Proposal"
      confirmLabel="Submit"
      isConfirmLoading={isLoading}
      onCloseComplete={onClose}
      onConfirm={onConfirm}
    >
      <Formik
        ref={innerRef}
        initialValues={{
          Name: "",
          govParams,
          ExecuteDuration: 0,
          Explanation: ""
        }}
        // validate={values => {
        //   const errors = {};
        //   Object.keys(govFields).map(key => {
        //     if (key.startsWith("Array.")) {
        //       Object.keys(govFields[key]).map(k => {
        //         if (
        //           values[key][k] === "" ||
        //           values[key][k] === null ||
        //           values[key][k] === undefined
        //         )
        //           errors[key][k] = "Required";
        //         return null;
        //       });
        //     } else if (key.startsWith("ArrayOne.")) {
        //       return null;
        //     } else if (
        //       values[key] === "" ||
        //       values[key] === null ||
        //       values[key] === undefined
        //     )
        //       errors[key] = "Required";
        //     return null;
        //   });
        //   if (!isEmpty(errors)) this.setState({ isLoading: false });
        //   return errors;
        // }}
        // ref={node => {
        //   this.dcbForm = node;
        //   return null;
        // }}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          // setTimeout(() => {
          submitCreateGOV(values, setSubmitting);
          // }, 400);
        }}
      >
        {({ values, errors, touched, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit} className="proposal-submit-form">
            <div>
              <TextInputField
                label="Name"
                name="Name"
                placeholder=""
                value={values.Name}
                onChange={e => {
                  setFieldValue("Name", e.target.value);
                }}
              />
              {errors.Name && touched.Name && (
                <span className="c-error">{errors.Name}</span>
              )}
            </div>

            {/* ------- */}

            <div>
              <TextInputField
                label="Basic Salary"
                name="govParams.BasicSalary"
                placeholder="0"
                value={values.govParams.BasicSalary || ""}
                onChange={e => {
                  setFieldValue("govParams.BasicSalary", e.target.value);
                }}
              />
            </div>
            <div>
              <TextInputField
                label="Fee Per KBTX"
                name="govParams.FeePerKbTx"
                placeholder="0"
                value={values.govParams.FeePerKbTx || ""}
                onChange={e => {
                  setFieldValue("govParams.FeePerKbTx", e.target.value);
                }}
              />
            </div>

            <fieldset>
              <legend>Oracle Network</legend>
              <div className="row">
                <div className="col-12">
                  <TextInputField
                    label="Acceptable Error Magin"
                    name="govParams.OracleNetwork.AcceptableErrorMargin"
                    placeholder=""
                    value={
                      values.govParams?.OracleNetwork?.AcceptableErrorMargin
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.OracleNetwork.AcceptableErrorMargin",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <fieldset>
                    <legend>Oracle Pub Keys</legend>
                    <FieldArray
                      name="govParams.OracleNetwork.OraclePubKeys"
                      render={arrayHelpers => (
                        <div>
                          {_.get(
                            values,
                            "govParams.OracleNetwork.OraclePubKeys",
                            []
                          ).map((oraclePubKey, index) => {
                            return (
                              <ArrayWrapper key={index}>
                                <Field
                                  name={`OraclePubKeys.${index}`}
                                  onChange={e =>
                                    arrayHelpers.replace(index, e.target.value)
                                  }
                                />
                                <Space />
                                <FontAwesomeIcon
                                  style={{ cursor: "pointer" }}
                                  icon={faMinus}
                                  onClick={() => arrayHelpers.remove(index)}
                                />
                              </ArrayWrapper>
                            );
                          })}

                          <FontAwesomeIcon
                            style={{ cursor: "pointer" }}
                            icon={faPlus}
                            onClick={() => arrayHelpers.push("")}
                          />
                        </div>
                      )}
                    />
                  </fieldset>
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Wrong Times Allowed"
                    name="govParams.OracleNetwork.WrongTimesAllowed"
                    placeholder="0"
                    value={
                      values.govParams?.OracleNetwork?.WrongTimesAllowed || ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.OracleNetwork.WrongTimesAllowed",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Quorum"
                    name="govParams.OracleNetwork.Quorum"
                    placeholder="0"
                    value={values.govParams?.OracleNetwork?.Quorum || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.OracleNetwork.Quorum",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Update Frequency"
                    name="govParams.OracleNetwork.UpdateFrequency"
                    placeholder="0"
                    value={
                      values.govParams?.OracleNetwork?.UpdateFrequency || ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.OracleNetwork.UpdateFrequency",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="Oracle Reward Multiplier"
                    name="govParams.OracleNetwork.OracleRewardMultiplier"
                    placeholder="0"
                    value={
                      values.govParams?.OracleNetwork?.OracleRewardMultiplier ||
                      ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.OracleNetwork.OracleRewardMultiplier",
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Refund Info</legend>
              <div className="row">
                <div className="col-12">
                  <TextInputField
                    label="Threshold To Large Tx"
                    name="govParams.RefundInfo.ThresholdToLargeTx"
                    placeholder="0"
                    value={
                      values.govParams?.RefundInfo?.ThresholdToLargeTx || ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.RefundInfo.ThresholdToLargeTx",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="Refund Amount"
                    name="govParams.RefundInfo.RefundAmount"
                    placeholder="0"
                    value={values.govParams?.RefundInfo?.RefundAmount || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.RefundInfo.RefundAmount",
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </fieldset>

            <div>
              <TextInputField
                label="Salary Per Tx"
                name="govParams.SalaryPerTx"
                placeholder="0"
                value={values.govParams.SalaryPerTx || ""}
                onChange={e => {
                  setFieldValue("govParams.SalaryPerTx", e.target.value);
                }}
              />
            </div>

            <fieldset>
              <legend>Selling Bonds</legend>
              <div className="row">
                <div className="col-12">
                  <TextInputField
                    label="Bond Name"
                    name="govParams.SellingBonds.BondName"
                    placeholder=""
                    value={values.govParams?.SellingBonds?.BondName}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.BondName",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="Bond Symbol"
                    name="govParams.SellingBonds.BondSymbol"
                    placeholder=""
                    value={values.govParams?.SellingBonds?.BondSymbol || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.BondSymbol",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="Total Issue"
                    name="govParams.SellingBonds.TotalIssue"
                    placeholder="0"
                    value={values.govParams?.SellingBonds?.TotalIssue || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.TotalIssue",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="Bonds To Sell"
                    name="govParams.SellingBonds.BondsToSell"
                    placeholder="0"
                    value={values.govParams?.SellingBonds?.BondsToSell || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.BondsToSell",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="Bond Price"
                    name="govParams.SellingBonds.BondPrice"
                    placeholder="0"
                    value={values.govParams?.SellingBonds?.BondPrice || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.BondPrice",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Maturity"
                    name="govParams.SellingBonds.Maturity"
                    placeholder="0"
                    value={values.govParams?.SellingBonds?.Maturity || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.Maturity",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Buy Back Price"
                    name="govParams.SellingBonds.BuyBackPrice"
                    placeholder="0"
                    value={values.govParams?.SellingBonds?.BuyBackPrice || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.BuyBackPrice",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Start Selling At"
                    name="govParams.SellingBonds.StartSellingAt"
                    placeholder="0"
                    value={values.govParams?.SellingBonds?.StartSellingAt || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.StartSellingAt",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Selling Within"
                    name="govParams.SellingBonds.SellingWithin"
                    placeholder="0"
                    value={values.govParams?.SellingBonds?.SellingWithin || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingBonds.SellingWithin",
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Selling GOV Tokens</legend>
              <div className="row">
                <div className="col-12">
                  <TextInputField
                    label="Total Issue"
                    name="govParams.SellingGOVTokens.TotalIssue"
                    placeholder="0"
                    value={values.govParams?.SellingGOVTokens?.TotalIssue || ""}
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingGOVTokens.TotalIssue",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="GOV Tokens To Sell"
                    name="govParams.SellingGOVTokens.GOVTokensToSell"
                    placeholder="0"
                    value={
                      values.govParams?.SellingGOVTokens?.GOVTokensToSell || ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingGOVTokens.GOVTokensToSell",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="col-12">
                  <TextInputField
                    label="GOV Token Price"
                    name="govParams.SellingGOVTokens.GOVTokenPrice"
                    placeholder="0"
                    value={
                      values.govParams?.SellingGOVTokens?.GOVTokenPrice || ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingGOVTokens.GOVTokenPrice",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Selling Within"
                    name="govParams.SellingGOVTokens.SellingWithin"
                    placeholder="0"
                    value={
                      values.govParams?.SellingGOVTokens?.SellingWithin || ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingGOVTokens.SellingWithin",
                        e.target.value
                      );
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextInputField
                    label="Start Selling At"
                    name="govParams.SellingGOVTokens.StartSellingAt"
                    placeholder="0"
                    value={
                      values.govParams?.SellingGOVTokens?.StartSellingAt || ""
                    }
                    onChange={e => {
                      setFieldValue(
                        "govParams.SellingGOVTokens.StartSellingAt",
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </fieldset>

            <div>
              <TextInputField
                label="Execute duration"
                name="ExecuteDuration"
                placeholder=""
                value={values.ExecuteDuration}
                onChange={e => {
                  setFieldValue("ExecuteDuration", e.target.value);
                }}
              />
              {errors.ExecuteDuration && touched.ExecuteDuration && (
                <span className="c-error">{errors.ExecuteDuration}</span>
              )}
            </div>
            <div>
              <TextInputField
                label="Explanation"
                name="Explanation"
                placeholder=""
                value={values.Explanation}
                onChange={e => {
                  setFieldValue("Explanation", e.target.value);
                }}
              />
              {errors.Explanation && touched.Explanation && (
                <span className="c-error">{errors.Explanation}</span>
              )}
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}

const Space = styled.div`
  display: inline-block;
  width: 12px;
`;

const ArrayWrapper = styled.div`
  margin-bottom: 12px;
`;
