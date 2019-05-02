import React from "react";
import axios from "axios";
import {Modal, Form, Input, notification} from "antd";
import _ from "lodash";
import {formatConstantValue} from "../../services/Formatter";

const initialFormState = {
  amount: "",
  priceLimit: ""
};

export function BuyModal({isShow, onClose, record, loadCrowdsales}) {
  if (!record) {
    return <></>;
  }
  const [isLoading, setIsLoading] = React.useState(false);

  const [formState, setFormState] = React.useState(initialFormState);

  React.useEffect(() => {
    setFormState(initialFormState);
  }, [isShow]);

  function setField(fieldName, value) {
    setFormState({...formState, [fieldName]: value});
  }

  async function submitForm() {
    try {
      setIsLoading(true);
      await axios.post(`${process.env.serviceAPI}/bond-market/dcb/buy`, {
        SaleID: record.SaleID,
        Amount: parseFloat(formState.amount * record.Price, 10) * 100, //convert to nano constant
        PriceLimit: parseFloat(formState.priceLimit, 10),
        TokenName: record.SellingAssetLabel,
        TokenID: record.SellingAsset
      });
      notification.success({message: "Buy Success!"});
      loadCrowdsales();
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
      title="Buy Crowdsale"
      visible={isShow}
      onOk={submitForm}
      onCancel={onClose}
      okButtonProps={{
        loading: isLoading,
        disabled: !formState.amount || !formState.priceLimit
      }}
    >
      <Form layout="vertical">
        <Form.Item label={`Amount`}>
          <Input
            addonAfter={`${record ? record.SellingAssetLabel : ''}`}
            placeholder="0"
            value={formState.amount}
            onChange={e => setField("amount", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Price">
          <Input
            addonAfter={record.BuyingAssetLabel}
            disabled={true}
            placeholder="0"
            value={formatConstantValue(formState.amount * record.Price)}
            onChange={e => setField("priceLimit", e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
