import React from 'react'
import '../styles/css/auth/AuthLayout.css'
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className='AuthGlobal'>
      <Outlet/>
    </div>
  )
}

export default AuthLayout