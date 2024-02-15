import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';

const style = {
    width: 400,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

function AddMember() {
    const [memberName, setMemberName] = useState();
    const [memberNumber, setMemberNumber] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <div className='d-flex justify-content-center '>
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
            </Box>
        </div>
    )
}

export default AddMember