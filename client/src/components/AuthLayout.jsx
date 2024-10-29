import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function AuthLayout({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.member.status)

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate("/login");
        }
        setLoader(false);
    }, [authStatus, navigate, authentication])

  return loader ? (
    <div className="flex flex-wrap">
        <div className="p-2 w-full">
            <h1 className="text-2xl font-bold">
                Loading...
            </h1>
        </div>
    </div>
  ) : <>{children}</>
}

export default AuthLayout;