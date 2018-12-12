import React from 'react';
import IntlMessages from '@ui/utility/intlMessages';
import MailAction from './singleMailActions';
import Button from '@ui/uielements/button';
import {
  BoardContents,
  BoardInfo,
  BoardList,
  Badge
} from './boardMail.style';

export default function boardMail(
  allMail,
  filterMails,
  index,
  selectMail,
  openVote
) {
  
  let mail = allMail[index];

  let recpName = mail.FirstName , signature = [];
  if(mail.LastName)
    recpName += ' ' + mail.LastName;

  if(!recpName){
    recpName = "Unknown";
  }
  signature = {
    splitLet: recpName
      .match(/\b(\w)/g)
      .join('')
      .split('', 2)
  };

  return (
    <BoardContents className="isoSingleMailContents">
      <div className="isoSingleMail">
        <BoardInfo className="isoMailInfo">
          <div className="isoRecipentsImg">
            {mail.img ? (
              <img alt="#" src={mail.img} />
            ) : (
              <span>{signature.splitLet}</span>
            )}
          </div>
          <h3>{recpName}</h3>
          <div className="isoMailAddress">
            <div className="isoAddress">
              <div className="mailEmail"><i className="ion-ios-email-outline" /> {mail.Email}</div>
              <div className="voteNum"><i className="ion-ios-star-outline" /> {mail.VoteNum} <IntlMessages id="Common.Votes" /></div>
            </div>
          </div>
        </BoardInfo>

        {/* <SingleMailHeader className="isoMailHeader">
          <h2>{mail.subject}</h2>
        </SingleMailHeader> */}
        <BoardList>
          <h4><IntlMessages id="Voting.TokenList" /></h4>
          <div className="board">
            <Badge
              status="error"
              text="CMB" />
            <div className="number">{mail.CMB}</div>
          </div>
          <div className="board">
            <Badge
              status="warning"
              text="DCB" />
            <div className="number">{mail.DCB}</div>
          </div>
          <div className="board">
            <Badge
              status="success"
              text="GOV" />
            <div className="number">{mail.GOV}</div>
          </div>
        </BoardList>
        <Button type="primary" size="large" onClick={() => openVote(mail)}>
          <IntlMessages id="Voting.VoteApplicant" />
        </Button>
      </div>
    </BoardContents>
  );
}
