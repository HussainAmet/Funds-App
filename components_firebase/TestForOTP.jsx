import React, { useState } from 'react'
import { auth } from "../firebase/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function TestForOTP() {
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const onCaptchaVerify = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
        });
    };

    const onSignup = () => {
        onCaptchaVerify();
        const appVerifier = window.recaptchaVerifier;
        const formatedPhoneNumber = '+91' + phoneNumber;

        signInWithPhoneNumber(auth, formatedPhoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                alert('OTP sent');
            })
            .catch((error) => {
                console.error('Error during OTP generation:', error);
            });
    };

    const onOtpVerify = () => {
        window.confirmationResult.confirm(otp).then(async (res) => {
            alert("OTP Verified!")
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <>
            <div id="recaptcha-container"></div>
            <TextField
                type="number"
                onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                margin="normal"
                value={phoneNumber}
                required
                fullWidth
                id="Phone Number"
                label="Phone Number"
                name="Phone Number"
                autoComplete="Phone Number"
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
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
                onClick={onSignup}
            >
                Generate OTP
            </Button>
            <TextField
                type="number"
                onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                margin="normal"
                required
                value={otp}
                fullWidth
                id="otp"
                label="otp"
                name="otp"
                autoComplete="otp"
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setOtp(e.target.value)}
            />
            <Button
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
                onClick={onOtpVerify}
            >
                Verify OTP
            </Button>
        </>
    )
}

export default TestForOTP