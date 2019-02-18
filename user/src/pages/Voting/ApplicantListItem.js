import React from "react";
import styled from "styled-components";
import cls from "classnames";
import _ from "lodash";
import { Avatar } from "./Avatar";

function getFullName(user) {
  return `${_.get(user, "FirstName")} ${_.get(user, "LastName")}`;
}

export function ApplicantListItem({ index, active, applicant, onClick }) {
  const user = _.get(applicant, "User", {});
  return (
    <Wrapper
      className={cls("applicant", {
        active
      })}
      key={applicant.ID}
      onClick={onClick}
    >
      <div>
        <AvatarAndName>
          <Avatar>{_.get(user, "FirstName.0", "").toUpperCase()}</Avatar>
          <Name title={getFullName(user)}>{getFullName(user)}</Name>
        </AvatarAndName>
        <Bio>{_.get(user, "Bio")}</Bio>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  &:hover {
    background-color: #f9fafb !important;
    cursor: pointer;
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

const Bio = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-top: 10px;
`;
