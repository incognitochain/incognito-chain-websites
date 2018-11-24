import React, { Component } from 'react';
import ContentHolder from "core-components/utility/contentHolder";
import ModalStyle, { ModalContent } from "./modal.style";
import TableWrapper from './style';
import { Modal as Modals } from 'antd';
import WithDirection from "../../../settings/withDirection";
import Button from "core-components/uielements/button";

const isoModal = ModalStyle(Modals);
const Modal = WithDirection(isoModal);

export default class extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      isDeposit: false,
      dataList: this.props.dataList.getAll(),
    };
  }

  onChange(pagination, filters, sorter) {
    const { dataList } = this.props;
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === 'ascend') {
        dataList.getSortAsc(sorter.columnKey);
      } else {
        dataList.getSortDesc(sorter.columnKey);
      }
      this.setState({ dataList: dataList.getAll() });
    }
  }

  onDeposit() {
    console.log('onDeposit');
    this.setState({ isDeposit: true });
  }

  render() {

    return (
      <ContentHolder>
        <TableWrapper
          columns={this.props.tableInfo.columns}
          onChange={this.onChange}
          dataSource={this.state.dataList}
          className="isoSortingTable"
          onDeposit={this.onDeposit}
        />

        <Modal
          visible={this.state.isDeposit}
          title="Title"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              size="large"
              loading={this.state.loading}
              onClick={this.handleOk}
            >
              Submit
            </Button>
          ]}
        >
          <p>
            Far far away, behind the word mountains, far from the
            countries Vokalia and Consonantia, there live the blind
            texts. Separated they live in Bookmarksgrove right at the
            coast of the Semantics, a large language ocean.
          </p>
          <p>Some contents...</p>
        </Modal>
      </ContentHolder>
    );
  }
}
