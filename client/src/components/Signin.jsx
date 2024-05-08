import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/joy/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from "axios"
import { useDispatch } from 'react-redux'
import { getAllMembersDetails, getMemberDetails, login } from '../store/memberDetailsSlice';
import config from "../config/config"

export default function Signin() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false)

  const logIn = async (data) => {
    setLoading(true)
    setError('');
    try {
      const userData = await axios.post(`${config.poductionUrl}${config.requestBaseUrl}login`, {phone: data.number})
      if (userData.data) {
        dispatch(login());
        dispatch(getMemberDetails({member: userData.data.member.data}));
        const role = userData.data.member.data.auth.data.role;
        if (role.includes('host')) {
          dispatch(getAllMembersDetails({allMembers: userData.data.members.filter((member) => member.data.auth.data.role.includes('member'))}));
          localStorage.setItem('phone', ((userData.data.member.data.auth.data.phone * 2) + 18))
          navigate("/host/dashboard/profile");
        } else if (role.includes('member')) {
          localStorage.setItem('phone', ((userData.data.member.data.auth.data.phone * 2) + 18))
          navigate("/member/dashboard/profile");
        } else {
          setLoading(false)
          setError("Phone number not found");
        }
      } else {
        setLoading(false)
        setError("Phone number not found");
      }
    } catch (error) {
      setLoading(false)
      console.error("Error occurred:", error);
      if (error.response.status === 404) setError("Member Not Found")
      else setError("An error occurred.");
    }
    setTimeout(() => {
      setError('')
    }, 3000)
  }

  useEffect(() => {
    const data = {number: ((localStorage.phone - 18) / 2)};
    if (data.number) {
      logIn(data)
    }
  }, [])

  return (
    <>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" onSubmit={handleSubmit(logIn)} sx={{ mt: 1 }}>
          <TextField
            type='number'
            onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');}}
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            onWheel={(e) => e.target.blur()}
            {...register("number", {
              required: true,
              maxLength: { value: 10, message: "max" },
              minLength: { value: 10, message: "min" },
            })}
          />
          <div className='d-flex flex-column ' style={{width: '309.92px'}}>
            {error && <span className='text-danger mt-1 '>{error}</span>}
            {errors.number && (errors.number.type === "minLength" || errors.number.type === "maxLength") && <span className='text-danger mt-1'>Invalid Number</span>}
          </div>
          <Button
            type='submit'
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className='py-3'
            disabled={loading}
          >
            {loading?
              <CircularProgress
                color="primary"
                variant="solid"
                size="sm"
              />
            :
              "Sign In"
            }
          </Button>
        </Box>
      </Box>
    </Container>
    </>
  );
}