import { useParams } from 'react-router-dom';

function PrfClassStuList() {
  const { id } = useParams();

  console.log('클래스 id:', id);

  return <div>수강생 리스트 페이지</div>;
}

export default PrfClassStuList;
