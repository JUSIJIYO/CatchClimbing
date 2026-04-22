import React from "react";
import { Outlet } from "react-router-dom";
import Header from '../components/layout/Header';
import DeactivateUser from '../components/common/DeactivateUser';

function MainLayout() {
  return (
    <>
      <Header />
      <DeactivateUser />
      <Outlet />
    </>
  );
}

export default MainLayout;
