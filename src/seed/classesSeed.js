import { db } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const branches = [
  { id: 'gangnam', name: '강남점' },
  { id: 'ilsan', name: '일산점' },
  { id: 'isu', name: '이수점' },
  { id: 'magok', name: '마곡점' },
  { id: 'mullae', name: '문래점' },
  { id: 'nonhyeon', name: '논현점' },
  { id: 'sadang', name: '사당점' },
  { id: 'seongsu', name: '성수점' },
  { id: 'sillim', name: '신림점' },
  { id: 'sinsa', name: '신사점' },
  { id: 'yangjae', name: '양재점' },
  { id: 'yeonnam', name: '연남점' },
  { id: 'hongdae', name: '홍대점' },
];

const classes = [];

branches.forEach((branch) => {
  for (let i = 1; i <= 4; i++) {
    classes.push({
      id: `class_${branch.id}_${i}`,
      data: {
        professorId: `prf_${branch.id}_${(i % 3) + 1}`,
        title: `클라이밍 클래스 ${i}`,
        professorName: '강사',
        openDate: '2026-05-01',
        branchName: branch.name,
        branchId: `theclimb_${branch.id}`,
        level: `V${i + 1}`,
        classMoney: 150000 + i * 10000,
        capacity: 10,
        currentCap: i,
        description: `${branch.name} ${i}번 클래스`,
        createdAt: serverTimestamp(),
      },
    });
  }
});

// 🔥 이거 있어야 진짜 올라감
export async function seedClasses() {
  for (const cls of classes) {
    await setDoc(doc(db, 'classes', cls.id), cls.data);
  }
  console.log('🔥 classes 업로드 완료');
}
