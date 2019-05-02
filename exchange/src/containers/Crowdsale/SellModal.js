import React from "react";
import {Modal, Form, Input, notification} from "antd";
import axios from "axios";
import _ from "lodash";
import {formatConstantValue} from "../../services/Formatter";

const initialFormState = {
  amount: "",
  priceLimit: ""
};

export function SellModal({isShow, onClose, record = {}, loadCrowdsales}) {
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

      await axios.post(`${process.env.serviceAPI}/bond-market/dcb/sell`, {
        SaleID: record.SaleID,
        TokenID: record.BuyingAsset,
        Amount: Number(formState.amount),
        PriceLimit: Number(formState.priceLimit),
        TokenName: record.BuyingAssetLabel
      });
      notification.success({message: "Sell Success!"});
      onClose();
      loadCrowdsales();
    } catch (e) {
      notification.error({
        message: _.get(
          e,
          "response.data.Error.Message",
          "Submit Sell Data Fail"
        )
      });
    }
    setIsLoading(false);
  }

  return (
    <Modal
      title="Sell bond to DCB"
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
            addonAfter={record.BuyingAssetLabel}
            placeholder="0"
            value={formState.amount}
            onChange={e => setField("amount", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Price">
          <Input
            addonAfter={record.SellingAssetLabel}
            disabled={true}
            placeholder="0"
            value={formatConstantValue(record.Price * formState.amount)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
