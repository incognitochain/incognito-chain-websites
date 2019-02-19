import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, TextInputField, SelectField } from "evergreen-ui";
import _ from "lodash";
import { Formik, FieldArray, Form } from "formik";
import { faPlus, faTimes } from "@fortawesome/pro-regular-svg-icons";

export default function DcbProposalDialog({
  isShown,
  dcbParams,
  isLoading,
  onClose,
  onConfirm,
  submitCreateDCB,
  innerRef,
  options: { sellingAssetOptions = {}, buyingAssetOptions = {} }
}) {
  return (
    <Dialog
      preventBodyScrolling
      isShown={isShown}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEscapePress={false}
      title="Create a DCB Proposal"
      confirmLabel="Submit"
      isConfirmLoading={isLoading}
      onCloseComplete={onClose}
      onConfirm={onConfirm}
    >
      <Formik
        ref={innerRef}
        initialValues={{
          Name: "",
          dcbParams,
          ExecuteDuration: 0,
          Explanation: ""
        }}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          submitCreateDCB(values, setSubmitting);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="proposal-submit-form">
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
            </div>

            <fieldset>
              <legend>List Loan Prams</legend>
              <FieldArray
                name="dcbParams.ListLoanParams"
                render={arrayHelpers => (
                  <div>
                    {_.get(values, "dcbParams.ListLoanParams", []).map(
                      (loanParams, index) => {
                        return (
                          <fieldset key={index}>
                            <legend style={{ textAlign: "right" }}>
                              <FontAwesomeIcon
                                title="Remove"
                                style={{ cursor: "pointer" }}
                                icon={faTimes}
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                }}
                              />
                            </legend>
                            <div className="row">
                              <div className="col-12">
                                <TextInputField
                                  label="Interest Rate"
                                  name={`dcbParams.ListLoanParams.${index}.InterestRate`}
                                  placeholder="0"
                                  value={loanParams.InterestRate || ""}
                                  onChange={e => {
                                    setFieldValue(
                                      `dcbParams.ListLoanParams.${index}.InterestRate`,
                                      e.target.value
                                    );
                                  }}
                                />

                                <TextInputField
                                  label="Liquidation Start"
                                  name={`dcbParams.ListLoanParams.${index}.LiquidationStart`}
                                  placeholder="0"
                                  value={loanParams.LiquidationStart || ""}
                                  onChange={e => {
                                    setFieldValue(
                                      `dcbParams.ListLoanParams.${index}.LiquidationStart`,
                                      e.target.value
                                    );
                                  }}
                                />

                                <TextInputField
                                  label="Maturity"
                                  name={`dcbParams.ListLoanParams.${index}.Maturity`}
                                  placeholder="0"
                                  value={loanParams.Maturity || ""}
                                  onChange={e => {
                                    setFieldValue(
                                      `dcbParams.ListLoanParams.${index}.Maturity`,
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </fieldset>
                        );
                      }
                    )}
                    <FontAwesomeIcon
                      style={{ cursor: "pointer" }}
                      icon={faPlus}
                      onClick={() => {
                        arrayHelpers.push({});
                      }}
                    />
                  </div>
                )}
              />
            </fieldset>

            <fieldset>
              <legend>List sale data</legend>

              <FieldArray
                name="dcbParams.ListSaleData"
                render={arrayHelpers => (
                  <div>
                    {_.get(values, "dcbParams.ListSaleData", []).map(
                      (sale, index) => (
                        <fieldset key={index}>
                          <legend style={{ textAlign: "right" }}>
                            <FontAwesomeIcon
                              title="Remove"
                              style={{ cursor: "pointer" }}
                              icon={faTimes}
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            />
                          </legend>
                          <div className="row">
                            <div className="col-12">
                              <TextInputField
                                label="End block"
                                name={`dcbParams.ListSaleData.${index}.EndBlock`}
                                placeholder="0"
                                value={sale.EndBlock || ""}
                                onChange={e => {
                                  setFieldValue(
                                    `dcbParams.ListSaleData.${index}.EndBlock`,
                                    e.target.value
                                  );
                                }}
                              />

                              <SelectField
                                label="Buying asset"
                                name={`dcbParams.ListSaleData.${index}.BuyingAsset`}
                                placeholder=""
                                value={
                                  values.dcbParams.ListSaleData[index]
                                    .BuyingAsset || ""
                                }
                                onChange={e => {
                                  setFieldValue(
                                    `dcbParams.ListSaleData.${index}.BuyingAsset`,
                                    e.target.value
                                  );
                                }}
                              >
                                {buyingAssetOptions.map(option => {
                                  return (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  );
                                })}
                              </SelectField>

                              <TextInputField
                                label="Buying amount"
                                name={`dcbParams.ListSaleData.${index}.BuyingAmount`}
                                placeholder="0"
                                value={
                                  values.dcbParams.ListSaleData[index]
                                    .BuyingAmount || ""
                                }
                                onChange={e => {
                                  setFieldValue(
                                    `dcbParams.ListSaleData.${index}.BuyingAmount`,
                                    e.target.value
                                  );
                                }}
                              />

                              <SelectField
                                label="Selling asset"
                                name={`dcbParams.ListSaleData.${index}.SellingAsset`}
                                placeholder=""
                                value={
                                  values.dcbParams.ListSaleData[index]
                                    .SellingAsset || ""
                                }
                                onChange={e => {
                                  setFieldValue(
                                    `dcbParams.ListSaleData.${index}.SellingAsset`,
                                    e.target.value
                                  );
                                }}
                              >
                                {sellingAssetOptions.map(option => {
                                  return (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  );
                                })}
                              </SelectField>

                              <TextInputField
                                label="Selling amount"
                                name={`dcbParams.ListSaleData.${index}.SellingAmount`}
                                placeholder="0"
                                value={
                                  values.dcbParams.ListSaleData[index]
                                    .SellingAmount || ""
                                }
                                onChange={e => {
                                  setFieldValue(
                                    `dcbParams.ListSaleData.${index}.SellingAmount`,
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </fieldset>
                      )
                    )}
                    <FontAwesomeIcon
                      style={{ cursor: "pointer" }}
                      icon={faPlus}
                      onClick={() => {
                        arrayHelpers.push({});
                      }}
                    />
                  </div>
                )}
              />
            </fieldset>
            <div className="row">
              <div className="col-6">
                <TextInputField
                  label="Min Loan response require"
                  name="dcbParams.MinLoanResponseRequire"
                  placeholder=""
                  value={values.dcbParams.MinLoanResponseRequire}
                  onChange={e => {
                    setFieldValue(
                      "dcbParams.MinLoanResponseRequire",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div className="col-6">
                <TextInputField
                  label="Min CMB approval require"
                  name="dcbParams.MinCMBApprovalRequire"
                  placeholder=""
                  value={values.dcbParams.MinCMBApprovalRequire}
                  onChange={e => {
                    setFieldValue(
                      "dcbParams.MinCMBApprovalRequire",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div className="col-6">
                <TextInputField
                  label="Late withdraw response fine"
                  name="dcbParams.LateWithdrawResponseFine"
                  placeholder=""
                  value={values.dcbParams.LateWithdrawResponseFine}
                  onChange={e => {
                    setFieldValue(
                      "dcbParams.LateWithdrawResponseFine",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div className="col-12">
                <fieldset>
                  <legend>Sale DCB tokens by USD</legend>
                  <div className="row">
                    <div className="col-6">
                      <TextInputField
                        label="Amount"
                        name="dcbParams.SaleDCBTokensByUSDData.Amount"
                        placeholder="0"
                        value={values.dcbParams.SaleDCBTokensByUSDData.Amount}
                        onChange={e => {
                          setFieldValue(
                            "dcbParams.SaleDCBTokensByUSDData.Amount",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <TextInputField
                        label="End block"
                        name="dcbParams.SaleDCBTokensByUSDData.EndBlock"
                        placeholder="0"
                        value={values.dcbParams.SaleDCBTokensByUSDData.EndBlock}
                        onChange={e => {
                          setFieldValue(
                            "dcbParams.SaleDCBTokensByUSDData.EndBlock",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            {/* ListLoanParams */}
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
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
