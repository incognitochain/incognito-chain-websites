import React from "react";
import styled from "styled-components";
import cls from "classnames";
import _ from "lodash";
import { Avatar } from "../Voting/Avatar";
import { TimeAgo } from "../../components/TimeAgo";

function getFullName(user) {
  return `${_.get(user, "FirstName")} ${_.get(user, "LastName")}`;
}

export function ProposalListItem({ index, active, proposal, onClick }) {
  const user = _.get(proposal, "User", {});

  return (
    <Wrapper
      className={cls("applicant", {
        active
      })}
      onClick={onClick}
    >
      <div>
        <AvatarAndName>
          <Avatar>{_.get(user, "FirstName.0", "").toUpperCase()}</Avatar>
          <Name title={getFullName(user)}>{getFullName(user)}</Name>
        </AvatarAndName>
        <ProposalName>{_.get(proposal, "Name")}</ProposalName>
        <Date>
          <TimeAgo date={proposal.CreatedAt} />
        </Date>
      </div>
    </Wrapper>
  );
}

const Date = styled.div`
  text-align: right;
  font-size: 14px;
`;

const Wrapper = styled.div`
  &:hover {
    background-color: #f9fafb !important;
    cursor: pointer;
  }
  &.active {
    background-color: #f2f4ff !important;
  }
  padding-top: 20px !important;
  padding-bottom: 20px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
`;

const AvatarAndName = styled.div`
  display: flex;
  flex-direction: row;
`;

const Name = styled.div`
  color: #050c33;
  font-size: 18px;
  padding-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProposalName = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-top: 10px;
`;
