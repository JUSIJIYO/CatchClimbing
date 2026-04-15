import React from "react";
import SignUpForm from "../../components/auth/SignUpForm";
import styles from '../../styles/css/auth/SignUpPage.module.css';
import { Outlet } from "react-router-dom";

function SignUpPage() {
  return (
    <>
      <main className={styles["signup-ct"]}>
      <Outlet/>
      </main>
    </>
  );
}

export default SignUpPage;
