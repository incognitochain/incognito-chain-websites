import React from "react";
import _ from "lodash";
import { Avatar } from "./Avatar";
import styled from "styled-components";
import sanitizeHtml from "sanitize-html";

const renderIf = condition => component => (condition ? component : null);

function getFullName(user) {
  return `${_.get(user, "FirstName")} ${_.get(user, "LastName")}`;
}

export function CenterContent({ applicant }) {
  const user = _.get(applicant, "User", {});
  const bio = _.get(user, "Bio", "");
  const sanitizedBio = React.useMemo(() => sanitizeHtml(bio), [bio]);

  return (
    <div className="col-12 col-lg-6">
      <div className="c-card" style={{height: "100%"}}>
        {renderIf(_.isEmpty(applicant))(
          <div className="empty">Please select applicant</div>
        )}
        {renderIf(!_.isEmpty(applicant))(
          <div className="bio">
            <div className="bio-header">
              <AvatarAndName>
                <Avatar>{_.get(user, "FirstName.0", "").toUpperCase()}</Avatar>
                <Name title={getFullName(user)}>{getFullName(user)}</Name>
              </AvatarAndName>
            </div>
            <div className="bio-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizedBio
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
