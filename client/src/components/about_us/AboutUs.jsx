import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'

function AboutUs() {
  return (
    <>
      <div>
        <div className="m-3 mb-0 d-flex align-items-center justify-content-center text-body-tertiary">
          <Link to="/login" className="text-body-tertiary position-absolute back-top" style={{left: "2%", top: "2%"}}>
            <p className="fw-semibold fs-3 m-0">Back</p>
          </Link>
          <h6 className="fw-semibold fs-3 m-0 mb-4 mt-1">About Us</h6>
        </div>
      </div>

      <div className="text-center">
        <div className="d-inline-flex flex-column gap-5 text-center justify-content-center px-4"
          style={{paddingTop: "40px", paddingBottom: "100px", border: "solid 1px black"}}>
          <div>
            <h2>Founded & Designed by</h2>
            <h5 className="m-0 pb-1">Hussain Gadisaaz</h5>
            <h5><a href="tel:+919887179382">(+91 9887179382)</a></h5>
          </div>
          <div>
            <h2>Developed by</h2>
            <h5 className="m-0 pb-1">Hussain Amet</h5>
            <h5><a href="tel:+918739975253">(+91 8739975253)</a></h5>
          </div>
          <div>
            <h2>Maintenance by</h2>
            <h5 className="m-0 pb-1">Hussain Amet</h5>
            <h5><a href="tel:+918739975253">(+91 8739975253)</a></h5>
          </div>
        </div>
      </div>

      <div className="back-bottom">
        <div className="m-3 mb-0 d-flex justify-content-center text-body-tertiary">
          <a href="/login" className="text-body-tertiary">
            <p className="fw-semibold fs-3 m-0">Back</p>
          </a>
        </div>
      </div>
    </>
  )
}

export default AboutUs