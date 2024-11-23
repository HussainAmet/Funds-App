import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { generatePath, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  getAllMembersDetails,
  getMemberDetails,
  login,
} from "../store/memberDetailsSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import { fireLogin } from "../firebase/auth";
// import { execute } from "../firebase/auth";
// import { auth } from "../firebase/firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Signin() {
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  // const [otp, setOtp] = useState('');
  // const [otpGenerated, setOtpGenerated] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const onCaptchaVerify = () => {
  //   window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  //     size: 'invisible'
  //   });
  // };

  // const onSignup = () => {
  //   setLoading(true);
  //   onCaptchaVerify();
  //   const appVerifier = window.recaptchaVerifier;
  //   const formatedPhoneNumber = '+91' + phoneNumber;

  //   signInWithPhoneNumber(auth, formatedPhoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       window.confirmationResult = confirmationResult;
  //       setOtpGenerated(true);
  //       setLoading(false);
  //       alert('OTP sent');
  //     })
  //     .catch((error) => {
  //       console.error('Error during OTP generation:', error);
  //       setLoading(false);
  //     });
  // };

  // const onOtpVerify = () => {
  //   setLoading(true);
  //   window.confirmationResult.confirm(otp).then(async (res) => {
  //     console.log(res);
  //     setLoading(false)
  //   }).catch((err) => {
  //     console.log(err);
  //     setLoading(false)
  //   })
  // }

  const logIn = async (data) => {
    // execute();
    setError("");
    setLoading(true);
    // if (!otpGenerated) {
    //   try {
    //     const userData = await fireLogin(data.number);
    //     if (userData.data) {
    //       setOtpGenerated(true)
    //     } else {
    //       throw new Error("Member Not Found");
    //     }
    //   } catch (error) {
    //     console.error("Error in logIn:", error);
    //     if (error?.message) {
    //       setError(error.message)
    //     } else {
    //       setError("An error occurred.");
    //     }
    //   }
    //   setTimeout(() => {
    //     setError("");
    //   }, 3000);
    //   setLoading(false);
    //   return
    // }
    try {
      const userData = await fireLogin(data.number);
      if (userData.data) {
        dispatch(login());
        dispatch(getMemberDetails({ member: userData.data.member.data }));
        const role = userData.data.member.data.auth.data.role;
        if (role.includes("host")) {
          dispatch(getAllMembersDetails({ allMembers: userData.data.members }));
          localStorage.setItem(
            "phone",
            userData.data.member.data.auth.data.phone * 2 + 18
          );
          navigate("/host/dashboard/profile");
        } else if (role.includes("member")) {
          localStorage.setItem(
            "phone",
            userData.data.member.data.auth.data.phone * 2 + 18
          );
          navigate("/member/dashboard/profile");
        } else {
          setLoading(false);
          throw new Error("Member Not Found");
        }
      } else {
        setLoading(false);
        throw new Error("Member Not Found");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error in logIn:", error);
      if (error?.message) {
        setError(error.message)
      } else {
        setError("An error occurred.");
      }
    }
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  useEffect(() => {
    const data = { number: (localStorage.phone - 18) / 2 };
    if (data.number) {
      logIn(data);
    }
  }, [localStorage]);

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 0 : prevProgress + 1
        );
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [loading]);

  return (
    <>
      <div id="recaptcha-container"></div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Box sx={{
            backgroundColor: 'lightGreen',
            fontSize: 14,
            borderRadius: 2,
            padding: 1,
            color: 'green',
            fontFamily: "monospace",
          }}>
            <p style={{margin: 1}}>Use These Sample Phone Numbers for Signin</p>
            <p style={{margin: 1}}><span style={{fontWeight: 600,}}>Admin</span> : 9988776655</p>
            <p style={{margin: 1}}><span style={{fontWeight: 600,}}>Host</span> : 9181716151,</p>
            <p style={{margin: 1}}><span style={{fontWeight: 600,}}>Member</span> : 1122334455</p>
          </Box> */}
          {error && <span className="text-danger mt-1 ">{error}</span>}
          <Box component="form" onSubmit={handleSubmit(logIn)} sx={{ mt: 1, width: '100%' }}>
            <TextField
              type="number"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
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
                value: phoneNumber,
                maxLength: { value: 10, message: "max" },
                minLength: { value: 10, message: "min" },
              })}
            />
            <div className="d-flex flex-column " style={{ width: "310" }}>
              {error && <span className="text-danger mt-1 ">{error}</span>}
              {errors.number &&
                (errors.number.type === "minLength" ||
                  errors.number.type === "maxLength") && (
                  <span className="text-danger mt-1">Invalid Number</span>
                )}
            </div>
            {/* {otpGenerated ?
              <TextField
                type="number"
                margin="normal"
                value={otp}
                onChange={setOtp}
                required
                fullWidth
                id="otp"
                label="Enter OTP"
                name="otp"
              />
              :
              ''
            } */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "var(--primary-300)",
                "&:hover": { backgroundColor: "var(--primary-200)" },
                "&:disabled": { backgroundColor: "var(--secondary)" },
              }}
              className="py-3"
            >
              {loading ? (
                <CircularProgressWithLabel
                  value={progress}
                  style={{ color: "var(--primary-300)" }}
                />
              ) : (
                otpGenerated ?
                  "Sign In"
                  :
                  "Generate Otp"
              )}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                color: "var(--primary-300)",
                borderColor: "var(--primary-300)",
                "&:hover": { backgroundColor: "var(--primary-200)", color: "white", borderColor: "white" },
                "&:disabled": { backgroundColor: "var(--secondary)" },
              }}
              disabled={loading}
              className="py-3"
              onClick={() => { logIn({ number: 9988776655 }) }}
            >
              {loading ? (
                <CircularProgressWithLabel
                  value={progress}
                  style={{ color: "var(--primary-300)" }}
                />
              ) : (
                "Sign In as a Guest"
              )}
            </Button>
          </Box>

          {/* {!otpGenerated ?
            <>
              <TextField
                type="number"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                margin="normal"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value) }}
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                onWheel={(e) => e.target.blur()}
              />
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mb: 2,
                  color: "var(--primary-300)",
                  borderColor: "var(--primary-300)",
                  "&:hover": { backgroundColor: "var(--primary-200)", color: "white", borderColor: "white" },
                  "&:disabled": { backgroundColor: "var(--secondary)" },
                }}
                disabled={loading}
                className="py-3"
                onClick={onSignup}
              >
                {loading ? (
                  <CircularProgressWithLabel
                    value={progress}
                    style={{ color: "var(--primary-300)" }}
                  />
                ) : (
                  "Send Otp"
                )}
              </Button>
            </>
            :
            <>
              <TextField
                type="number"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                margin="normal"
                value={otp}
                onChange={(e) => { setOtp(e.target.value) }}
                required
                fullWidth
                id="otp"
                label="OTP"
                name="otp"
                autoComplete="otp"
                onWheel={(e) => e.target.blur()}
              />
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mb: 2,
                  color: "var(--primary-300)",
                  borderColor: "var(--primary-300)",
                  "&:hover": { backgroundColor: "var(--primary-200)", color: "white", borderColor: "white" },
                  "&:disabled": { backgroundColor: "var(--secondary)" },
                }}
                disabled={loading}
                className="py-3"
                onClick={onOtpVerify}
              >
                {loading ? (
                  <CircularProgressWithLabel
                    value={progress}
                    style={{ color: "var(--primary-300)" }}
                  />
                ) : (
                  "Verify Otp"
                )}
              </Button>
            </>
          } */}
        </Box>
      </Container>
    </>
  );
}