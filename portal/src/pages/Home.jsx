import React from 'react';
import Cookies from 'js-cookie';
import {
  TableStyle,
  FixedContainer,
  ProposalBox,
  ShareWrapper,
  ApplyBoardWrapper,
  MessageContent,
  BioWrapper
} from "@/styles/custom.style";
import LayoutWrapper from '@ui/utility/layoutWrapper.js';
import {Row, Col, Modal as Modals} from 'antd';
import basicStyle from '@/settings/basicStyle';
import Box from '@ui/utility/box';
import Button from '@ui/uielements/button';
import IntlMessages from '@ui/utility/intlMessages';
import Tabs, {TabPane} from '@ui/uielements/tabs';


class Home extends React.Component {
  static propTypes = {}

  constructor(props) {
    super(props);
    const auth = Cookies.get('auth');
    this.state = {
      auth,
    };
  }

  componentDidMount() {
    const {auth} = this.state;
    if (!auth) {
      window.location.assign('http://auth.constant.money/login');
    }
  }

  render() {
    const {boards, user, loading} = this.state;
    const {rowStyle, colStyle, colStyle0, boxStyle0, boxStyleBg, gutter} = basicStyle;

    return (
      <FixedContainer>
        <LayoutWrapper>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={16} sm={24} xs={24} style={colStyle} className="col">
              <Box className="mainBox"
                   title={<IntlMessages id="Portal.Home.BigBox.Hello"/>}
                   subtitle={<span className="editBio" onClick={() => this.openEditBio()}>Edit</span>}>
                {
                  user && <div className="bio">{user.Bio}</div>
                }
              </Box>
            </Col>
            <Col md={8} sm={24} xs={24} style={colStyle} className="col">
              <Box style={boxStyle0}>
                <ProposalBox>
                  <div className="desc">
                    <IntlMessages id="Portal.Home.Proposal.Description"/>
                    <br/><span className="create"><IntlMessages id="Common.CreateNewOne"/>.</span>
                  </div>

                  <div className="action">
                    <Button type="default" className="btn" style={{marginBottom: '1rem'}}
                            onClick={() => this.openProposal(1)}>
                      <IntlMessages id="Proposal.CreateDCB"/>
                    </Button>
                    <Button type="default" className="btn" onClick={() => this.openProposal(2)}>
                      <IntlMessages id="Proposal.CreateGOV"/>
                    </Button>
                  </div>
                </ProposalBox>
              </Box>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter}>
            {
              boards && boards.map(box => {
                return (
                  <Col md={8} sm={24} xs={24} style={colStyle} key={box.key} className="col">
                    <Box style={boxStyleBg(box.background)} className="cardBoard"
                         title={<IntlMessages id={box.title}/>}
                         subtitle={<IntlMessages id={box.subTitle}/>}
                    >
                      {
                        box.applied ?
                          <Button className="btnApplied">
                            <IntlMessages id="Common.Applied"/>
                          </Button>
                          :
                          <Button className="btnApply" onClick={() => this.openApplyBoard(box)}>
                            <IntlMessages id={box.btnText}/>
                          </Button>
                      }
                    </Box>
                  </Col>);
              })
            }
          </Row>
          <TableStyle className="isoLayoutContent">
            <Tabs className="isoTableDisplayTab">
            </Tabs>
          </TableStyle>
          <ShareWrapper>
            <h3><IntlMessages id="Common.Share"/></h3>
            <Button type="default" className="">
              <IntlMessages id="Common.Facebook"/>
            </Button>
            <Button type="default" className="">
              <IntlMessages id="Common.Twitter"/>
            </Button>
            <Button type="default" className="">
              <IntlMessages id="Common.CopyLink"/>
            </Button>

          </ShareWrapper>
        </LayoutWrapper>
      </FixedContainer>
    );
  }
}

export default Home;
