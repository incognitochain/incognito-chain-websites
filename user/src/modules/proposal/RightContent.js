import React from "react";
import _ from "lodash";

export function RightContent({ data = {}, onClickVote }) {
  return (
    <div className="col-12 col-lg-3">
      <div className="c-card">
        {_.isEmpty(data) && <div className="empty">Please select proposal</div>}
        {!_.isEmpty(data) && (
          <div className="right-bar">
            <button
              className="c-btn c-btn-primary"
              type="button"
              style={{ marginTop: 10 }}
              onClick={onClickVote}
            >
              Vote this proposal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
