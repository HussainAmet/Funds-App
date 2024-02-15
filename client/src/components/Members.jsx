import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Link, Outlet } from 'react-router-dom';

export default function Members() {
  const [savings, setSavings] = useState(37000)

  return (
    <>
      <div className='profile-info'>
        <p className='fs-2 text-center'>Total Savings: {savings}</p>
      </div>
      <div className='d-flex w-100 '>
        <input type="text" placeholder='Search Member' className='ms-3 mb-3 w-50 border-top-0 border-end-0 border-start-0 border-primary' maxLength={50}/>
        <Link to="/admin/members/add-member" className='text-center w-50'><Button variant="contained">Add Member</Button></Link>
      </div>
      <Outlet />
    </>
  );
}