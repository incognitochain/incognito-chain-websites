import React from "react";
import { CenterContent } from "./CenterContent";
import { RightContent } from "./RightContent";

export function Applicant({ applicant = {}, onClickVote }) {
  return (
    <>
      <CenterContent applicant={applicant} />
      <RightContent applicant={applicant} onClickVote={onClickVote} />
    </>
  );
}
