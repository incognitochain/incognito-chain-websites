import React from 'react';
import _ from 'lodash';
import { timeDifference } from '@/helpers/utility';
import MailListWrapper from './mailList.style';
import { rtl } from '@/settings/withDirection';

export default function mailList(
  mails,
  selectMail,
  selectedMail,
  toggleListVisible
) {
  const renderSingleMail = (mail, key) => {
    const onClick = () => {
      selectMail(mail.ID, mails);
      if (toggleListVisible) {
        toggleListVisible();
      }
    };
    const isSelected = selectedMail === mail.ID;
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
    }
  
    
    const activeClass = isSelected ? 'activeMail' : '';
    return (
      <div
        key={`list${key}`}
        onClick={onClick}
        className={`${activeClass} isoMailList`}
      >
        <div className="isoRecipentsImg">
          {mail.img ? (
            <img alt="#" src={mail.img} />
          ) : (
            <span>{signature.splitLet}</span>
          )}
        </div>

        <div className="isoMailInfo">
          <div className="infoHead">
            <p className="isoRecipents">{recpName}</p>
            <span className="isoReceiveDate">{timeDifference(mail.date)}</span>
          </div>
          {/* <p className="isoSubject">{mail.subject}</p> */}
          <p className="isoBio">{_.truncate(mail.Name, {length: 72, separator: ' '})}</p>
        </div>
      </div>
    );
  };
  return (
    <MailListWrapper className="isoMailListWrapper">
      {mails.map((mail, index) => renderSingleMail(mail, index))}
    </MailListWrapper>
  );
}
