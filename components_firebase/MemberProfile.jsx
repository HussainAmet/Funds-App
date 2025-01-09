import React from 'react'
import { Outlet, Link } from 'react-router-dom';

export default function MemberProfile() {

  return (
    <>
        <Link to="/host/members" className='w-fit d-block text-body-tertiary'>
          <div className='m-3'>
              <p className='fw-semibold fs-4'>Back</p>
          </div>
        </Link>
        <Outlet/>
    </>        
  )
}