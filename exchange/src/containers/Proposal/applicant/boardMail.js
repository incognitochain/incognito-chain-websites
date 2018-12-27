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

  let recpName = mail.User.FirstName , signature = [];
  if(mail.User.LastName)
    recpName += ' ' + mail.User.LastName;

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
              <div className="mailEmail"><i className="ion-ios-email-outline" /> {mail.User.Email}</div>
              <div className="voteNum"><i className="ion-ios-star-outline" /> {mail.VoteNum} <IntlMessages id="Common.Votes" /></div>
            </div>
          </div>
        </BoardInfo>
        <Button type="primary" size="large" onClick={() => openVote(mail)}>
          <IntlMessages id="Proposal.VoteProposal" />
        </Button>
      </div>
    </BoardContents>
  );
}
