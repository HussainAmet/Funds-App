import { Outlet, NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function UserDashboard() {
  const { of } = useParams();

  const [currentMemberData, setCurrentMemberData] = useState([]);

  const currentMember = useSelector((state) => state.member.memberDetails)

  useEffect(() => {
    setCurrentMemberData(currentMember);
  }, [currentMember]);

  return (
    <>
      <div className='profile-info'>
          <p className='fs-2 text-center'>{of === undefined ? `Association Savings: ${currentMemberData?.totalSavings?.totalSavings}` : "" || of === "savings" ? `My Savings: ${currentMemberData?.saving}` : `Loan Pending: ${currentMemberData?.loanRemaining}`}</p>
      </div>
      <div className='me-2 ms-2'>
        <div className='mb-4 d-flex justify-content-around'>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/dashboard/profile">Profile</NavLink>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/dashboard/details/savings">Savings</NavLink>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/dashboard/details/loan">Loan</NavLink>
        </div>
        <Outlet />
      </div>
    </>
  );
}