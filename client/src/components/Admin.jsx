import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Admin() {

  return (
    <>
      <div className='me-2 ms-2'>
        <div className='mb-4 d-flex justify-content-around'>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/admin/profile">My Profile</NavLink>
          <NavLink className={({isActive}) => `text-decoration-none tab ${isActive && 'tabFocus'}`} to="/admin/members">All Members</NavLink>
        </div>
      </div>
      <Outlet />
    </>
  );
}