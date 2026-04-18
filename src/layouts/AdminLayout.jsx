import React from 'react'
import Header from '../components/layout/Header'
import SideBar from '../components/layout/SideBar'
import { Outlet } from 'react-router-dom'
import '../styles/css/admin/AdminLayout.css'


function AdminLayout() {
  return (
    <>
      <Header />
      <div className='adminlayout-ct'>
        <SideBar />
        <main className='adminlayout-main-ct'>
          <Outlet />
        </main>
      </div>
    </>
  )
}
export default AdminLayout