/*
import React from "react";
import axios from "axios";
import { Modal, Form, Input, notification } from "antd";
import _ from "lodash";

const initialFormState = {
  totalAmount: "",
  pricePerToken: ""
};

export function BuyModal({ isShow, onClose, record = {}, loadGovTokens }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const [formState, setFormState] = React.useState(initialFormState);

  React.useEffect(() => {
    setFormState(initialFormState);
  }, [isShow]);

  function setField(fieldName, value) {
    setFormState({ ...formState, [fieldName]: value });
  }

  async function submitForm() {
    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_SERVICE_API}/wallet/buy_gov_tokens`,
        {
          TokenID: record.GOVTokenID,
          TotalAmount: parseFloat(formState.totalAmount) * 100,
          PricePerToken: parseFloat(formState.pricePerToken)
        }
      );
      notification.success({ message: "Buy Success!" });
      loadGovTokens();
      onClose();
    } catch (e) {
      notification.error({
        message: _.get(e, "response.data.Error.Message", "Submit Buy Data Fail")
      });
    }
    setIsLoading(false);
  }

  return (
    <Modal
      title="Buy GOV Token"
      visible={isShow}
      onOk={submitForm}
      onCancel={onClose}
      okButtonProps={{
        loading: isLoading,
        disabled: !formState.totalAmount || !formState.pricePerToken
      }}
    >
      <Form layout="vertical">
        <Form.Item label="Total Amount">
          <Input
            placeholder="0"
            value={formState.totalAmount}
            onChange={e => setField("totalAmount", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Price Per Token">
          <Input
            placeholder="0"
            value={formState.pricePerToken}
            onChange={e => setField("pricePerToken", e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
*/
