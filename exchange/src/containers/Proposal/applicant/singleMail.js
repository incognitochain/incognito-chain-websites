import React from 'react';
import { timeDifference } from '@/helpers/utility';
import MailAction from './singleMailActions';
import IntlMessages from '@ui/utility/intlMessages';
import {
  SingleMailContents,
  SingleMailInfo,
  SingleMailBody,
} from './singleMail.style';

export default function singleMail(
  allMail,
  filterMails,
  index,
  selectMail
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

  let arr = [], json = JSON.parse(mail.Data);
  Object.keys(json).forEach(function(key) {
    arr.push({name: key, value: json[key]});
  });
  
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
                {recpName} <br /><div className="mailEmail">{mail.User.Email}</div>
              </h3>
              <span className="mailDate">{timeDifference(mail.Date)}</span>
            </div>
          </div>
        </SingleMailInfo>

        {/* <SingleMailHeader className="isoMailHeader">
          <h2>{mail.subject}</h2>
        </SingleMailHeader> */}
        <SingleMailBody className="isoMailBody">
          {
            arr.map(e => {
              return (<div className="isoContactCardInfos" key={e.name}>
                <p className="isoInfoLabel"><IntlMessages id={"Proposal." + e.name} /></p>
                <p className="isoInfoDetails">{e.value}</p>
              </div>)
            })
          }
        </SingleMailBody>
      </div>
      <MailAction
        mail={mail}
        filterMails={filterMails}
        selectMail={selectMail}
      />
    </SingleMailContents>
  );
}
