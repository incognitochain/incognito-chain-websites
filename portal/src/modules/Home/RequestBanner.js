import React, { Component } from 'react';
import basicStyle from '@/settings/basicStyle';
import IntlMessages from '@ui/utility/intlMessages';
import Box from '@ui/utility/box';
import Button from '@ui/uielements/button';


import {
  ProposalBox,
} from "@/styles/custom.style";

class RequestBanner extends Component {
  render(){
    const { boxStyle0 } = basicStyle;
    return (
      <Box style={boxStyle0}>
          <ProposalBox>
            <div className="desc">
              <IntlMessages id="Portal.Home.Proposal.Description"/>
            </div>

            <div className="action">
              <Button type="default" className="btn" style={{marginBottom: '1rem'}}
                      onClick={() => {window.location.href='/create'}}>
                <IntlMessages id="Proposal.CreateRequest"/>
              </Button>
            </div>
          </ProposalBox>
        </Box>
    );
  }
}
export default RequestBanner;
