import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// 파이어베이스 연동관련코드는 AI를 이용하여 작성했습니다
export const buildUsersQuery = (role = null, { orderDir = 'desc', isApproved = null, branchId = null } = {}) => {
  const ref = collection(db, 'users')
  const constraints = []
  if (role)                  constraints.push(where('role', '==', role))
  if (isApproved !== null)   constraints.push(where('isApproved', '==', isApproved))
  if (branchId)              constraints.push(where('branchId', '==', branchId))
  // role 필터 + orderBy 조합은 복합 인덱스 필요 → role 없는 경우만 서버 정렬, 나머지는 클라이언트 정렬
  if (!role) constraints.push(orderBy('createdAt', orderDir))
  return query(ref, ...constraints)
}

/** branchId → branchName 매핑 테이블 반환 */
export const fetchBranchNames = async () => {
  const snap = await getDocs(collection(db, 'branches'))
  const map = {}
  snap.docs.forEach((d) => { map[d.id] = d.data().name ?? d.id })
  return map
}

export const getBranchName = async (branchId) => {
  const snap = await getDoc(doc(db, 'branches', branchId))
  return snap.exists() ? (snap.data().name ?? branchId) : branchId
}

export const updateUserDoc = async (uid, fields) => {
  await updateDoc(doc(db, 'users', uid), fields);
};

export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const getTotalUserCount = async () => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.size;
};

export const getTotalBranchCount = async () => {
  const snap = await getDocs(collection(db, 'classes'));
  const branchIds = new Set(snap.docs.map((d) => d.data().branchId).filter(Boolean));
  return branchIds.size;
};

export const getTotalReservationCount = async (branchId = null) => {
  const q = branchId
    ? query(collection(db, 'classes'), where('branchId', '==', branchId))
    : collection(db, 'classes');
  const snap = await getDocs(q);
  return snap.docs.reduce((sum, d) => sum + (d.data().currentCap || 0), 0);
};

const toDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getTodayReservationStats = async (branchId = null) => {
  const today = toDateString(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toDateString(yesterdayDate);

  const baseQuery = (dateStr) => branchId
    ? query(collection(db, 'classes'), where('branchId', '==', branchId), where('openDate', '==', dateStr))
    : query(collection(db, 'classes'), where('openDate', '==', dateStr));

  const [todaySnap, yesterdaySnap] = await Promise.all([
    getDocs(baseQuery(today)),
    getDocs(baseQuery(yesterday)),
  ]);

  const todayCount = todaySnap.docs.reduce((sum, d) => sum + (d.data().currentCap || 0), 0);
  const yesterdayCount = yesterdaySnap.docs.reduce((sum, d) => sum + (d.data().currentCap || 0), 0);

  return { count: todayCount, increase: todayCount - yesterdayCount };
};

export const getPopularClasses = async (branchId = null) => {
  const q = branchId
    ? query(collection(db, 'classes'), where('branchId', '==', branchId))
    : collection(db, 'classes');
  const snap = await getDocs(q);
  const classes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return classes
    .sort((a, b) => (b.currentCap || 0) - (a.currentCap || 0))
    .slice(0, 6);
};

export const getBranchUtilization = async () => {
  const snap = await getDocs(collection(db, 'classes'));
  const branchMap = {};
  snap.docs.forEach((d) => {
    const { branchId, branchName, capacity, currentCap } = d.data();
    if (!branchId) return;
    if (!branchMap[branchId]) {
      branchMap[branchId] = { branchName: branchName || branchId, totalCapacity: 0, totalCurrentCap: 0 };
    }
    branchMap[branchId].totalCapacity += capacity || 0;
    branchMap[branchId].totalCurrentCap += currentCap || 0;
  });
  return Object.values(branchMap)
    .map((b) => ({
      branchName: b.branchName,
      utilization: b.totalCapacity > 0 ? Math.round((b.totalCurrentCap / b.totalCapacity) * 100) : 0,
    }))
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 6);
};

export const buildClassesQuery = ({ branchId = null, orderDir = 'desc' } = {}) => {
  const ref = collection(db, 'classes')
  const constraints = []
  if (branchId) constraints.push(where('branchId', '==', branchId))
  constraints.push(orderBy('createdAt', orderDir))
  return query(ref, ...constraints)
}

export const buildPostsQuery = ({ branchId = null, orderDir = 'desc' } = {}) => {
  const ref = collection(db, 'posts')
  const constraints = []
  if (branchId) constraints.push(where('branchId', '==', branchId))
  constraints.push(orderBy('createdAt', orderDir))
  return query(ref, ...constraints)
}

export const buildReviewsQuery = ({ branchId = null, orderDir = 'desc' } = {}) => {
  const ref = collection(db, 'reviews')
  const constraints = []
  if (branchId) constraints.push(where('branchId', '==', branchId))
  constraints.push(orderBy('createdAt', orderDir))
  return query(ref, ...constraints)
}

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));
};

export const deleteReview = async (reviewId) => {
  await deleteDoc(doc(db, 'reviews', reviewId));
};

export const getClassesByProfessor = async (professorUid) => {
  const q = query(
    collection(db, 'classes'),
    where('professorId', '==', professorUid),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getPendingProfessors = async () => {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'professor'),
    where('isApproved', '==', false)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};
