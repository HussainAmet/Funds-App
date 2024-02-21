import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 325,
    height: "fit-content",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    zIndex: 1000,
    display: "flex",
    flexDirection: 'column',
    gap: '15px',
  };

function AddMember(props) {
    const [memberName, setMemberName] = useState();
    const [memberNumber, setMemberNumber] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    window.addEventListener('popstate', () => {
        props.onClose()
    });

    

    return (
        <div >
            <Box component="form" sx={style}>
                {errors.number && (errors.number.type === "minLength" || errors.number.type === "maxLength") && <span className='text-danger mt-1'>Invalid Number</span>}
                <TextField
                required
                fullWidth
                id="memberName"
                label="Member Name"
                name="memberName"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                {...register("memberName", {
                    required: true,
                })}
                />
                <TextField
                required
                fullWidth
                id="phone"
                label="Member Phone Number"
                name="phone"
                type='number'
                value={memberNumber}
                onWheel={(e) => e.target.blur()}
                onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');}}
                onChange={(e) => setMemberNumber(e.target.value)}
                {...register("number", {
                    required: true,
                    maxLength: { value: 10, message: "max" },
                    minLength: { value: 10, message: "min" },
                })}
                />
                <Button type='submit' variant="contained" className='fs-6 w-100'>Add New Member</Button>
                <Link to="/admin/members"><Button variant="contained" className='fs-6 w-100 bg-secondary' onClick={props.onClose}>Cancel</Button></Link>
            </Box>
        </div>
    )
}

export default AddMember