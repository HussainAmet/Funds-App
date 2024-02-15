import { Outlet, NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function UserDashboard() {
    const { of } = useParams();
    const [savings, setSavings] = useState(3000);
    const [loan, setLoan] = useState(9000);

  return (
    <>
      <div className='profile-info'>
          <p className='fs-2 text-center'>{of === undefined ? `Association Savings: ${savings}` : "" || of === "savings" ? `My Savings: ${savings}` : `Loan Pending: ${loan}`}</p>
      </div>
      <div className='me-2 ms-2'>
        <div className='mb-4 d-flex justify-content-around'>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/dashboard/profile">Profile</NavLink>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/dashboard/details/savings">Savings</NavLink>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/dashboard/details/loan">Loan</NavLink>
        </div>
        <Outlet/>
      </div>
    </>
  );
}