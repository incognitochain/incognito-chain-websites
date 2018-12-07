import React from 'react';
import ComposeMail from './composeMail';
import { timeDifference } from '@/helpers/utility';
import MailAction from './singleMailActions';
import { tags, tagColor } from './mailTags.js';
import {
  SingleMailContents,
  SingleMailHeader,
  SingleMailInfo,
  SingleMailBody,
  SingleMailReply
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
  const recpName = mail.name;
  const signature = {
    splitLet: recpName
      .match(/\b(\w)/g)
      .join('')
      .split('', 2)
  };

  const labelColor = mail.tags
    ? tagColor[tags.findIndex(tags => tags === mail.tags)]
    : '';

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
                {mail.name} <span>&lt;{mail.email}&gt;</span>
              </h3>
              <span className="mailDate">{timeDifference(mail.date)}</span>
            </div>
          </div>
        </SingleMailInfo>

        <SingleMailHeader className="isoMailHeader">
          <h2>{mail.subject}</h2>
        </SingleMailHeader>
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
