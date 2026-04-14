import React, { useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../../services/authService';
import Modal from '../../components/common/Modal';
import BranchCard from '../../components/branch/BranchCard';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/css/branch/BranchListPage.module.css';

function BranchListPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const branchList = [
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
    { id: 1, name: '서밋 클라이밍 센터', location: '서울 강남구' },
    { id: 2, name: '볼더 하우스', location: '서울 마포구' },
  ];

  return (
    <>
      <div className={styles['header']}>
        <h1>클라이밍 센터</h1>
        <p>나에게 맞는 클라이밍 센터를 찾아보세요</p>
      </div>
      <div className={styles['content']}>
        <div className={styles['branch-list']}>
          {branchList.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </div>

      {/* {!isLogin && showModal && (
        <Modal
          title="로그인"
          message="로그인을 먼저 진행해주세요"
          cancelText="취소"
          confirmText="로그인하러가기"
          onCancel={() => setShowModal(false)}
          onConfirm={() => navigate('/login')}
        />
      )} */}
    </>
  );
}

export default BranchListPage;
