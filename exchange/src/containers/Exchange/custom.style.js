import styled from 'styled-components';
import { palette } from 'styled-theme';

const rowStyle = {
  width: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
  marginLeft: '0.3rem',
  marginRight: '0.3rem',
  marginTop: '0.3rem',
};
const colStyle = {
  padding: '0.3rem',
};

const boxStyle = {
  padding: '1rem'
}

const TableStyle = styled.div`
border: none !important;
    padding: 0px !important;
  .isoLayoutContent {
    
  }

  .ant-tabs-content {
    margin-top: 40px;
  }

  .ant-tabs-nav {
    &.ant-tabs-tab {
      
    }
    
    > div {
      color: ${palette('secondary', 2)};
      padding: 0;

      
      &.ant-tabs-ink-bar {
        background-color: ${palette('primary', 0)};
      }

      &.ant-tabs-tab-active {
        color: ${palette('primary', 0)};
        margin-right: 10px;
      }
    }
  }
`;

export { rowStyle, colStyle, boxStyle, TableStyle };
