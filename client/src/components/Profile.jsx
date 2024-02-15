import React from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 325,
    height: 200,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
};

export default function Profile() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loanAmount, setLoanAmount] = useState('');

    const handleLoanAmountChange = (event) => {
    const loan = event.target.value.replace(/\D/, '').slice(0, 6);
    setLoanAmount(loan);
  };

  return (
    <>
      <div className='ms-3'>
        <div>
          <p className='m-0 fs-6 text-secondary'>Name</p>
          <p className='fs-3'>Murtaza Amet</p>
        </div>
        <div>
          <p className='m-0 fs-6 text-secondary'>Phone</p>
          <p className='fs-3'>9660983477</p>
        </div>
        <div>
          <p className='m-0 fs-6 text-secondary'>Savings</p>
          <p className='fs-3'>15000</p>
        </div>
        <div>
          <p className='m-0 fs-6 text-secondary'>Loan Remaining</p>
          <p className='fs-3'>9000</p>
        </div> 
        <div>
          <p className='m-0 fs-6 text-secondary'>Loan Month</p>
          <p className='fs-3'>March 2024</p>
        </div>
      </div>
      <div className='text-center'><Button variant="contained" onClick={handleOpen} className='w-50'>Request Loan</Button></div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            className='w-100'
            id="outlined-number"
            label="Enter Loan Amount"
            type="number"
            value={loanAmount}
            InputLabelProps={{
              shrink: true,                        
            }}
            onChange={handleLoanAmountChange}
            onWheel={(e) => e.target.blur()}
          />
        <Button variant="contained" onClick={handleClose} className='mt-3 fs-6 w-100'>Request Loan</Button>
        </Box>
      </Modal>
    </>        
  )
}
