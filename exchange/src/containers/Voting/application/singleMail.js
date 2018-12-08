import React from 'react';
import { timeDifference } from '@/helpers/utility';
import MailAction from './singleMailActions';
import {
  SingleMailContents,
  SingleMailInfo,
  SingleMailBody,
} from './singleMail.style';

export default function singleMail(
  allMail,
  filterMails,
  index,
  replyMail,
  changeReplyMail,
  selectMail,
  toggleListVisible
) {
  const mail = allMail[index];
  const recpName = mail.FirstName + ' ' + mail.LastName;
  console.log(recpName);
  const signature = {
    splitLet: recpName
      .match(/\b(\w)/g)
      .join('')
      .split('', 2)
  };

  return (
    <SingleMailContents className="isoSingleMailContents">
      <div className="isoSingleMail">
        <SingleMailInfo className="isoMailInfo">
          <div className="isoRecipentsImg">
            {mail.img ? (
              <img alt="#" src={mail.img} />
            ) : (
              <span>{signature.splitLet}</span>
            )}
          </div>
          <div className="isoMailAddress">
            <div className="isoAddress">
              <h3>
                {recpName} <br /><div className="mailEmail">{mail.Email}</div>
              </h3>
              <span className="mailDate">{timeDifference(mail.Date)}</span>
            </div>
          </div>
        </SingleMailInfo>

        {/* <SingleMailHeader className="isoMailHeader">
          <h2>{mail.subject}</h2>
        </SingleMailHeader> */}
        <SingleMailBody className="isoMailBody">
          <p>{mail.Bio}</p>
        </SingleMailBody>
      </div>
      <MailAction
        mail={mail}
        filterMails={filterMails}
        selectMail={selectMail}
        toggleListVisible={toggleListVisible}
      />
    </SingleMailContents>
  );
}
