import React from "react";
import SignUpForm from "../../components/auth/SignUpForm";
import styles from '../../styles/css/auth/SignUpPage.module.css';

function SignUpPage() {
  return (
    <>
      <main className={styles["signup-ct"]}>
      <SignUpForm />
      </main>
    </>
  );
}

export default SignUpPage;
