import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import moment from 'moment-timezone';
import axios from 'axios';
import config from '../config/config';
import { getMemberDetails, getAllMembersDetails, logout } from '../store/memberDetailsSlice';

function UpdateDetails() {
    const [memberName, setMemberName] = useState('');
    const [memberData, setMemberData] = useState([]);
    const [date, setDate] = useState()
    const [year, setYear] = useState()
    const [month, setMonth] = useState()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [amount, setAmount] = useState()

    const { register, handleSubmit } = useForm();
    const { what } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) => {
        setMemberName(event.target.value);
    };

    const currentMember = useSelector((state) => state.member.memberDetails)
    const userData = useSelector((state) => state.member.allMembersDetails)

    const updateDetails = async (data) => {
        setError('')
        const selectedMember = memberData.find((member) => member.data.auth.data.name === data.member )
        try {
            if (what === 'add-savings' || what === 'add-loan-installment') {
                const response = await axios.post(`${config.poductionUrl}${config.requestBaseUrl}${what === 'add-savings'?'add-savings' : 'add-loan-installment'}`, {id: selectedMember._id, amount: data.amount, year, month, date })
                if (response.data === "ok" && response.status === 200) {
                    if (what === 'add-savings') {
                        setSuccess("Savings Added")
                        setTimeout(() => {
                            setSuccess('');
                        }, 5000);
                        setMemberName('')
                        setAmount('')
                    } else {
                        setSuccess("Loan Installment Added")
                        setTimeout(() => {
                            setSuccess('');
                        }, 5000);
                        setMemberName('')
                        setAmount('')
                    }
                }
            } else if (what === 'give-loan') {
                const loanDate = month + ' ' + year
                const response = await axios.post(`${config.poductionUrl}${config.requestBaseUrl}give-loan`, {id: selectedMember._id, amount: data.amount, loanDate, date })
                if (response.data === "ok" && response.status === 200) {
                    setSuccess(`Loan given to ${data.member}`)
                    setTimeout(() => {
                        setSuccess('');
                    }, 5000);
                    setMemberName('')
                    setAmount('')
                }
            }
            const updatedData = await axios.post(`${config.poductionUrl}${config.requestBaseUrl}login`, {phone: currentMember?.auth?.data?.phone})
            if (updatedData.data) {
                dispatch(getMemberDetails({member: updatedData.data.member.data}));
                dispatch(getAllMembersDetails({allMembers: updatedData.data.members}));
            } else {
                dispatch(logout())
                navigate('/login')
            }
        } catch (error) {
            setTimeout(() => {
                setError(error.response.data);
            }, 5000);
        }
    }

    useEffect(() => {
        const timezone = 'Asia/Kolkata';
        const date = moment.tz(timezone);
        setDate(date.format());
        setYear(date.year());
        setMonth(date.format('MMMM'));
        setMemberData(userData);
    }, [userData, handleChange])

    return (
        <>
            <h2 className='m-4 text-body-tertiary'>{what}</h2>
            <Box component="form" onSubmit={handleSubmit(updateDetails)} sx={{ minWidth: 130, margin: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Member</InputLabel>
                    <Select
                        {...register("member", {
                            required: true,
                        })}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={memberName}
                        label="Select Member"
                        onChange={handleChange}
                    >
                        {memberData.map((member) => (
                            <MenuItem key={member._id} value={member.data.auth.data.name}>{member.data.auth.data.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {error && <span className='fw-semibold text-white mt-2 mb-2 p-2 d-block text-center bg-danger'>{error}</span>}
                {success && <span className='fw-semibold text-bg-success mt-2 mb-2 p-2 d-block text-center'>{success}</span>}
                <FormControl sx={{ width: 'fit-content', marginTop: 3, display: 'flex', gap: 3 }}>
                    <div className='d-flex gap-4'>
                        <div>
                            <FormLabel>Year</FormLabel>
                            <Textarea
                                value={year}
                                disabled
                                sx={{ width: '150px' }}
                            />
                        </div>
                        <div>
                            <FormLabel>Month</FormLabel>
                            <Textarea
                                value={month}
                                disabled
                                sx={{ width: '150px' }}
                            />
                        </div>
                    </div>
                    <div>
                        {what === 'add-savings' ? <FormLabel>Saving Amount</FormLabel> : <FormLabel>Loan Amount</FormLabel>}
                        <Textarea
                            {...register("amount", {
                                required: true,
                            })}
                            onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');}}
                            value={amount}
                            placeholder={0}
                            onChange={(e) => {setAmount(e.target.value)}}
                        />
                    </div>
                </FormControl>
                <Button
                    type='submit'
                    variant="contained"
                    sx={{ mt: 3, mb: 2, display: 'block' }}
                    className='px-5 py-2'
                >
                    Submit
                </Button>
            </Box>
        </>
    )
}

export default UpdateDetails;
