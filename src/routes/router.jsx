import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
// import MainLayout from '../layouts/MainLayout'
import SideBar from '../components/layout/SideBar';
import DashBoardPage from '../pages/admin/DashBoardPage';

export const router = createBrowserRouter([
    {
        path : '/',
        element : <SideBar/>,
        children : [
            {
                path: 'admin',
                element : <DashBoardPage />
            },
            {
                path: 'admin/prfmanage',
                element : <prfManagePage />
            }
        ]
    },
]) 