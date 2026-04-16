import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export const seedRecords = async () => {
  try {
    const records = [
      {
        uid: 'test_user_123',
        title: 'V4 문제 클리어',
        branchId: 'theclimb_hongdae',
        branchName: '홍대점',
        visitDate: '2026-04-05',
        level: 'V4',
        tryCount: 3,
        description: '슬랩 문제',
        memo: '발 잘 써야함',
        image: 'https://via.placeholder.com/150',
        createdAt: new Date(),
      },
      {
        uid: 'test_user_123',
        title: '오버행 루트 연습',
        branchId: 'theclimb_hongdae',
        branchName: '홍대점',
        visitDate: '2026-04-06',
        level: 'V5',
        tryCount: 5,
        description: '힘 많이 쓰는 문제',
        memo: '코어 중요',
        image: 'https://via.placeholder.com/150',
        createdAt: new Date(),
      },
      {
        uid: 'test_user_123',
        title: 'V3 워밍업',
        branchId: 'theclimb_hongdae',
        branchName: '홍대점',
        visitDate: '2026-04-04',
        level: 'V3',
        tryCount: 2,
        description: '쉬운 문제',
        memo: '몸 풀기',
        image: 'https://via.placeholder.com/150',
        createdAt: new Date(),
      },
    ];

    for (const record of records) {
      await addDoc(collection(db, 'records'), record);
    }

    console.log('🔥 테스트 데이터 추가 완료');
  } catch (e) {
    console.error('❌ 데이터 추가 실패:', e);
  }
};
