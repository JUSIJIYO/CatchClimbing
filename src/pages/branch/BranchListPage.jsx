import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Modal from '../../components/common/Modal';
import BranchCard from '../../components/branch/BranchCard';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/css/branch/BranchListPage.module.css';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import headerStyles from '../../styles/css/common/PageHeader.module.css';

function BranchListPage() {
  const [branchList, setBranchList] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('theclimb_gangnam');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const q = query(
          collection(db, 'branches'),
          where('status', '==', 'approved')
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBranchList(data);
      } catch (e) {
        console.error('branches 가져오기 실패:', e);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLogin(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className={headerStyles.header}>
        <h1>클라이밍 센터</h1>
        <p>나에게 맞는 클라이밍 센터를 찾아보세요</p>
      </div>
      <div className={styles['content']}>
        <div className={styles['branch-list']}>
          {branchList.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onClick={() => navigate(`/branch/${branch.id}`)}
            />
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
