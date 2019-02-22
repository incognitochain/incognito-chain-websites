import React from "react";
import { Modal, Form, Input, notification } from "antd";
import axios from "axios";

export function SellModal({ isShow, onClose, record = {} }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = React.useRef();

  async function submitForm() {
    try {
      setIsLoading(true);
      const formValues = formRef.current.fieldsStore.getAllValues();

      await axios.post(`${process.env.serviceAPI}/bond-market/dcb/sell`, {
        SaleID: record.SaleID,
        TokenID: record.BuyingAsset,
        TotalAmount: Number(formValues.TotalAmount),
        PricePerBond: Number(formValues.PricePerBond)
      });
      notification.success({ message: "Submitted!" });
      onClose();
    } catch (e) {
      notification.error({
        message: `Fail to submit Sell data`
      });
    }
    setIsLoading(false);
  }

  return (
    <Modal
      title="Sell Crowdsell"
      visible={isShow}
      onOk={submitForm}
      onCancel={onClose}
      okButtonProps={{ loading: isLoading }}
    >
      <SellForm ref={formRef} />
    </Modal>
  );
}

const SellForm = Form.create({ name: "SellForm" })(
  ({ form: { getFieldDecorator } }) => {
    return (
      <Form layout="vertical">
        <Form.Item label="Total Amount">
          {getFieldDecorator("TotalAmount", {})(<Input placeholder="0" />)}
        </Form.Item>
        <Form.Item label="Price Per Bond">
          {getFieldDecorator("PricePerBond", {})(<Input placeholder="0" />)}
        </Form.Item>
      </Form>
    );
  }
);
