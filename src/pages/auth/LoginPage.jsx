import LoginForm from "../../components/auth/LoginForm";
import styles from '../../styles/css/auth/LoginPage.module.css';

function LoginPage() {
  return (
    <>
      <main className={styles['login-ct']}>
        <h2> 로그인 </h2>
        <p> 다시 오신 것을 환영합니다.</p>
        <LoginForm />
      </main>
    </>
  );
}

export default LoginPage;
