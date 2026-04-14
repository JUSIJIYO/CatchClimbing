import React from 'react'
import LoginPage from '../pages/auth/LoginPage'
import '../styles/css/auth/AuthLayout.css'

function AuthLayout() {
  return (
    <div className='AuthGlobal'>
      <LoginPage />
    </div>
  )
}

export default AuthLayout