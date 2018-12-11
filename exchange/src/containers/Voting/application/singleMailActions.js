import React, { Component } from 'react';
import Popover from '@ui/uielements/popover';
import Popconfirm from '@ui/feedback/popconfirm';
import notification from '@ui/notification';
import {
  SingleMailActions,
  MailActionsWrapper,
  MailPaginationWrapper,
  MailActionDropdown
} from './singleMailActions.style';
import { rtl } from '@/settings/withDirection';

class DeleteButton extends Component {
  render() {
    return (
      <Popconfirm
        title={`Are you sure to delete this applicant?`}
        okText="DELETE"
        cancelText="No"
        onConfirm={() => {
          notification('error', `Deleted selected applicant`, '');
        }}
      >
        <button type="button" className="mailDelete">
          <i className="ion-android-delete" />
        </button>
      </Popconfirm>
    );
  }
}

export default class extends Component {
  render() {
    const { mail, filterMails, selectMail, toggleListVisible } = this.props;
    const index = filterMails.findIndex(
      filterMail => filterMail.ID === mail.ID
    );
    const toggleView = () => {
      toggleListVisible();
    };
    return (
      <SingleMailActions className="isoMailActionsController">
        {toggleListVisible ? (
          <button className="mailBackBtn" onClick={toggleView}>
            Inbox
          </button>
        ) : (
          ''
        )}
        {/* <MailActionsWrapper className="isoMailActions">
          <button
            type="button"
            className="mailArchive"
            onClick={() => {
              notification('success', 'this mail archived');
            }}
          >
            <i className="ion-android-archive" />
          </button>

          <button
            type="button"
            className="mailReport"
            onClick={() => {
              notification('success', 'Reported as spam');
            }}
          >
            <i className="ion-android-alert" />
          </button>

          <DeleteButton />
        </MailActionsWrapper> */}

        <MailPaginationWrapper className="isoSingleMailPagination">
          {index === 0 ? (
            ''
          ) : (
            <button
              type="button"
              className="prevPage"
              onClick={() => selectMail(filterMails[index - 1].ID)}
            >
              <i
                className={
                  rtl === 'rtl' ? 'ion-chevron-right' : 'ion-chevron-left'
                }
              />
            </button>
          )}

          {index + 1 === filterMails.length ? (
            ''
          ) : (
            <button
              type="button"
              className="nextPage"
              onClick={() => selectMail(filterMails[index + 1].ID)}
            >
              <i
                className={
                  rtl === 'rtl' ? 'ion-chevron-left' : 'ion-chevron-right'
                }
              />
            </button>
          )}
        </MailPaginationWrapper>
      </SingleMailActions>
    );
  }
}
