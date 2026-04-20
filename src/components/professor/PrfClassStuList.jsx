import PrfClassStuItem from './PrfClassStuItem';
import styles from '../../styles/css/professor/PrfClassStuList.module.css';

function PrfClassStuList({ students, onUpdateStatus }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>No.</th>
          <th>이름</th>
          <th>레벨</th>
          <th>전화번호</th>
          <th>이메일</th>
          <th>승인 상태</th>
          <th>승인 관리</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="7">수강생이 없습니다.</td>
          </tr>
        ) : (
          students.map((stu, idx) => (
            <PrfClassStuItem
              key={stu.id}
              stu={stu}
              index={idx}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default PrfClassStuList;
