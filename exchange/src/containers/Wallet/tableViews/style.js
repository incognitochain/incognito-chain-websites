import Table from '../../../components/uielements/table';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  transition,
  boxShadow,
  borderRadius,
} from '../../../settings/style-util';
import WithDirection from '../../../settings/withDirection';

const TableWrapper = styled(Table)`
  overflow: hidden;
  overflow-x: auto;
  background-color: #ffffff;
  
  
  .ant-table-body {
    overflow-x: auto;
  }

  .ant-table-thead > tr > th {
    color: ${palette('secondary', 2)};
    font-size: 13px;
    background-color: ${palette('secondary', 1)};
    border-bottom: 0;

    &.ant-table-column-sort {
      background: ${palette('secondary', 1)};
      margin: ${props =>
        props['data-rtl'] === 'rtl' ? '0 4px 0 0' : '0 0 0 4px'};
    }
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    font-size: 0.9rem;
    padding: 16px 15px;
    white-space: nowrap;
    text-align: ${props => (props['data-rtl'] === 'rtl' ? 'right' : 'left')};

    p {
      margin-bottom: 0;
    }
  }

  .ant-table-tbody > tr > td {
    font-size: 0.9rem;
    color: ${palette('text', 3)};
    border-bottom: 1px solid ${palette('border', 0)};

    a {
      color: ${palette('primary', 0)};
      ${transition()};

      &:hover {
        color: ${palette('primary', 4)};
      }
    }
  }

  .ant-table-thead > tr.ant-table-row-hover > td,
  .ant-table-tbody > tr.ant-table-row-hover > td,
  .ant-table-thead > tr:hover > td,
  .ant-table-tbody > tr:hover > td {
    background-color: transparent;
  }

  .ant-table-bordered .ant-table-thead > tr > th {
    border-bottom: 1px solid ${palette('border', 0)};
  }

  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid ${palette('border', 0)};
  }

  .ant-table-pagination {
    float: ${props => (props['data-rtl'] === 'rtl' ? 'left' : 'right')};
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    border: 1px solid ${palette('border', 0)};
  }

  .ant-pagination-disabled,
  .ant-pagination-prev.ant-pagination-disabled,
  .ant-pagination-next.ant-pagination-disabled {
    border: 1px solid ${palette('border', 0)};

    a {
      border: 0;
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    transform: ${props =>
      props['data-rtl'] === 'rtl' ? 'rotate(180deg)' : 'rotate(0)'};
  }

  .ant-pagination-prev,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    margin: ${props =>
      props['data-rtl'] === 'rtl' ? '0 0 0 8px' : '0 8px 0 0'};
  }

  .ant-pagination-item {
    margin: ${props =>
      props['data-rtl'] === 'rtl' ? '0 0 0 8px' : '0 8px 0 0'};

    &:hover {
      border-color: ${palette('primary', 0)};
      ${transition()};
    }

    &:hover a {
      color: ${palette('primary', 0)};
    }
  }

  .ant-pagination-item-active {
    background-color: ${palette('primary', 0)};
    border-color: ${palette('primary', 0)};

    a {
      color: #ffffff;
    }

    &:hover a {
      color: #ffffff;
    }
  }

  .ant-table-expanded-row {
    background: ${palette('grayscale', 6)};

    p {
      color: ${palette('text', 3)};
    }
  }

  .ant-spin-nested-loading > div > .ant-spin {
    max-height: none;

    .ant-spin-dot i {
      color: ${palette('primary', 0)};
    }
  }

  .ant-table-header {
    background-color: transparent;
  }

  .ant-table-title {
    background: ${palette('secondary', 1)};
    color: ${palette('secondary', 2)};
    font-size: 13px;
    font-weight: 500;
    padding: 16px 30px;
    ${borderRadius()};
  }

  .ant-table-footer {
    background: ${palette('secondary', 1)};
    color: ${palette('secondary', 2)};
    font-size: 12px;
    font-weight: 400;
    padding: 16px 30px;
    ${borderRadius()};
  }

  .ant-table-content {
    overflow-x: auto;
  }

  .ant-table-column-sorter-up.on .anticon-caret-up,
  .ant-table-column-sorter-down.on .anticon-caret-up,
  .ant-table-column-sorter-up.on .anticon-caret-down,
  .ant-table-column-sorter-down.on .anticon-caret-down {
    color: ${palette('primary', 0)};
  }
`;

const WDCustomizedTableWrapper = styled.div`
  .isoCustomizedTableControlBar {
    margin-bottom: 40px;

    .ant-form-item {
      margin: ${props =>
        props['data-rtl'] === 'rtl' ? '0 0 0 16px' : '0 16px 0 0'};
    }

    .ant-form-item-label {
      label {
        color: ${palette('secondary', 2)};

        &:after {
          margin: ${props =>
            props['data-rtl'] === 'rtl' ? '0 2px 0 8px' : '0 8px 0 2px'};
        }
      }
    }

    .ant-switch-checked {
      border-color: ${palette('primary', 0)};
      background-color: ${palette('primary', 0)};
    }
  }
`;

const RateTag = styled.span`
  padding: 0 5px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  background-color: ${palette('primary', 0)};
  min-width: 60px;
  color: #ffffff;
  text-transform: capitalize;

  &.rateDown {
    background-color: ${palette('error', 0)};
  }

  &.rateSame {
    background-color: ${palette('warning', 0)};
  }

  &.rateUp {
    background-color: ${palette('success', 0)};
  }
`;

const CustomizedTableWrapper = WithDirection(WDCustomizedTableWrapper);

export { CustomizedTableWrapper, RateTag };
export default WithDirection(TableWrapper);
