import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
        <div className="text-center p-1 bg-light">
            <p className='m-0'><Link to="/about-us">About us</Link> | <Link to="/get-in-touch">Get in touch</Link></p>
        </div>
    </>
  )
}

export default Footer