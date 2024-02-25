import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, Outlet, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Profile() {

  const [currentMemberData, setCurrentMemberData] = useState([]);

  const currentMember = useSelector((state) => state.member.memberDetails)

  useEffect(() => {
    setCurrentMemberData(currentMember);
  }, [currentMember]);

  return (
    <>
      <div className='ms-3'>
        <div>
          <p className='m-0 fs-6 text-secondary'>Name</p>
          <p className='fs-3'>{currentMemberData?.auth?.data?.name}</p>
        </div>
        <div>
          <p className='m-0 fs-6 text-secondary'>Phone</p>
          <p className='fs-3'>{currentMemberData?.auth?.data?.phone}</p>
        </div>
        <div>
          <p className='m-0 fs-6 text-secondary'>Savings</p>
          <p className='fs-3'>{currentMemberData?.saving}</p>
        </div>
        <div>
          <p className='m-0 fs-6 text-secondary'>Loan Remaining</p>
          <p className='fs-3'>{currentMemberData?.loanRemaining}</p>
        </div> 
        {currentMemberData.loanDate ?
          <div>
            <p className='m-0 fs-6 text-secondary'>Loan Date</p>
            <p className='fs-3'>{currentMemberData?.loanDate}</p>
          </div>
        : ""}
      </div>
      {
        currentMemberData?.auth?.data?.role === "host" ?
        <>
          <div className='d-flex mb-4 justify-content-around'>
            <Link to="/admin/profile/details/savings"><Button variant="contained" className='fs-6 w-100' >Savings Details</Button></Link>
            <Link to="/admin/profile/details/loan"><Button variant="contained" className='fs-6 w-100' >Loan Details</Button></Link>
          </div>
          <div className='ms-2 me-2 mb-2 '><Outlet /></div>
        </>
        :
        ""
      }
    </>        
  )
}
