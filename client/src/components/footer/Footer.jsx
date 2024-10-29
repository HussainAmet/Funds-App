import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
        <div className="text-center p-1 bg-light">
            <p className='m-0'><a href="/aboutUs.html">About us</a> | <a href="/getInTouch.html">Get in touch</a></p>
        </div>
    </>
  )
}

export default Footer