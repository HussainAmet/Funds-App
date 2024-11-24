import React from 'react'
import { useNavigate } from 'react-router-dom'

function GetInTouch() {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <div className="m-3 mb-0 d-flex align-items-center justify-content-center text-body-tertiary">
                    <div onClick={() => navigate(-1)} className="text-body-tertiary position-absolute back-top cursor-pointer" style={{left: "2%", top: "2%"}}>
                        <p className="fw-semibold fs-3 m-0">Back</p>
                    </div>
                    <h6 className="fw-semibold fs-3 m-0 mb-4 mt-1">Get in Touch</h6>
                </div>
            </div>

            <div className="text-center">
                <div className="d-inline-flex flex-column gap-5 text-center justify-content-center px-5"
                    style={{paddingTop: "40px", paddingBottom: "100px", border: "solid 1px black"}}>
                    <div>
                        <h2>Email</h2>
                        <h5><a href="mailto:hussainamet@gmail.com">hussainamet@gmail.com</a></h5>
                    </div>
                    <div>
                        <h2>WhatsApp</h2>
                        <h5><a href="https://wa.me/+918739975253" target="_blank">Chat with Me</a></h5>
                    </div>
                </div>
            </div>

            <div className="back-bottom">
                <div className="m-3 mb-0 d-flex justify-content-center text-body-tertiary cursor-pointer">
                    <div onClick={() => navigate(-1)} className="text-body-tertiary">
                        <p className="fw-semibold fs-3 m-0">Back</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GetInTouch