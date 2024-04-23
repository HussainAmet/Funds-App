import React, { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import config from '../config/config';

export default function MemberProfile() {
  const { id } = useParams();

  const [currentMemberData, setCurrentMemberData] = useState([]);

  useEffect(() => {
    axios.post(`${config.poductionUrl}${config.requestBaseUrl}get-member-details`, { id })
    .then((currentMember) => {
      setCurrentMemberData(currentMember.data.data);
    });
  }, [id]);

  return (
    <>
      <Link to="/admin/members" className='w-fit d-block text-body-tertiary'>
        <div className='m-3'>
            <p className='fw-semibold fs-4'>Back</p>
        </div>
      </Link>
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
      <div className='d-flex mb-4 justify-content-around'>
        <Link to={`/member-profile/${id}/details/savings`}><Button variant="contained" className='fs-6 w-100' >Savings Details</Button></Link>
        <Link to={`/member-profile/${id}/details/loan`}><Button variant="contained" className='fs-6 w-100' >Loan Details</Button></Link>
      </div>
      <div className='m-2'>
        <Outlet/>
      </div>
    </>        
  )
}