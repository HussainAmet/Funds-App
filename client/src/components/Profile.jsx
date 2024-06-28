import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { resetTimer } from "../hooks/reloadTimout"

export default function Profile() {
  const [currentMemberData, setCurrentMemberData] = useState([]);

  const currentMember = useSelector((state) => state.member.memberDetails);
  const allMembers = useSelector((state) => state.member.allMembersDetails);

  const { id } = useParams();

  useEffect(() => {
    // resetTimer();
    if (id) {
      setCurrentMemberData(allMembers.find((member) => member._id === id).data);
    } else setCurrentMemberData(currentMember);
  }, [currentMember, allMembers, id]);

  return (
    <>
      <div className="ms-3">
        <div className="profile-info">
          <p className="fs-2 text-center">
            Total Balance: {currentMember?.totalSavings?.totalSavings}
          </p>
        </div>
        <div>
          <p className="m-0 fs-6 text-secondary">Name</p>
          <p className="fs-3">{currentMemberData?.auth?.data?.name}</p>
        </div>
        <div>
          <p className="m-0 fs-6 text-secondary">Phone</p>
          <p className="fs-3">{currentMemberData?.auth?.data?.phone}</p>
        </div>
        <div>
          <p className="m-0 fs-6 text-secondary">Savings</p>
          <p className="fs-3">{currentMemberData?.saving || 0}</p>
        </div>
        {currentMemberData?.loanRemaining && (
          <div>
            <p className="m-0 fs-6 text-secondary">Loan Remaining</p>
            <p className="fs-3">{currentMemberData?.loanRemaining}</p>
          </div>
        )}
        {currentMemberData.loanDate && (
          <div>
            <p className="m-0 fs-6 text-secondary">Loan Date</p>
            <p className="fs-3">{currentMemberData?.loanDate}</p>
          </div>
        )}
      </div>
    </>
  );
}
