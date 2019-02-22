import React from "react";
import axios from "axios";
import { Modal, Form, Input, notification } from "antd";

export function BuyModal({ isShow, onClose, record }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = React.useRef();

  async function submitForm() {
    try {
      setIsLoading(true);
      const formValues = formRef.current.fieldsStore.getAllValues();

      await axios.post(`${process.env.serviceAPI}/bond-market/dcb/buy`, {
        SaleID: record.SaleID,
        TotalAmount: Number(formValues.TotalAmount),
        PricePerBond: Number(formValues.PricePerBond)
      });
      notification.success({ message: "Submitted!" });
      onClose();
    } catch (e) {
      notification.error({
        message: `Fail to submit Buy data`
      });
    }
    setIsLoading(false);
  }

  return (
    <Modal
      title="Buy Crowdsell"
      visible={isShow}
      onOk={submitForm}
      onCancel={onClose}
      okButtonProps={{ loading: isLoading }}
    >
      <BuyForm ref={formRef} />
    </Modal>
  );
}

const BuyForm = Form.create({ name: "BuyForm" })(
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
