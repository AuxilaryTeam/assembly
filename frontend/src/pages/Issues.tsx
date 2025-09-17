import React from "react";
import ActiveIssuesList from "../components/issues/ActiveIssuesList";
import VoteForm from "../components/issues/VoteForm";

const Issues = () => {
  return (
    <div>
      <ActiveIssuesList />
      <VoteForm />
    </div>
  );
};

export default Issues;
