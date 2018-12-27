import styled from 'styled-components';
import WithDirection from '@/settings/withDirection';

const WDComponentTitleWrapper = styled.h1`
  font-size: 2rem;
  font-weight: 400;
  color: #2C3B8F;
  margin-bottom: 2rem;

  @media only screen and (max-width: 767px) {
    margin: 0 10px;
    margin-bottom: 30px;
  }
`;

const ComponentTitleWrapper = WithDirection(WDComponentTitleWrapper);
export { ComponentTitleWrapper };
