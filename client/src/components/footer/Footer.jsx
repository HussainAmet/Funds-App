import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
        <div className="mt-auto text-center p-3 bg-light">
            <p className='m-0'>Get your own personalized Funds App. Email on: <Link to="mailto:associationfunds53@gmail.com">associationfunds53@gmail.com</Link></p>
        </div>
    </>
  )
}

export default Footer