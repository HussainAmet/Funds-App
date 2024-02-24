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
    <Link to="/admin/members">
      <div className='m-3 text-body-tertiary'>
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={48} d="M244 400L100 256l144-144M120 256h292"></path></svg>
        <p className='fw-bold'>Go back</p>
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
        {currentMemberData.loanMonth ?
          <div>
            <p className='m-0 fs-6 text-secondary'>Loan Month</p>
            <p className='fs-3'>{currentMemberData?.loanMonth}</p>
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