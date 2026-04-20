import React from 'react';
import { useSearchParams,useNavigate } from 'react-router-dom';
import CommuList from '../../components/community/CommuList';
import headerStyles from "../../styles/css/common/PageHeader.module.css";

function CommuPostPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branchId = searchParams.get('branch');

  return (
    <div>
      <div className={headerStyles.header}>
        <h1>전체 커뮤니티</h1>
        <p>클라이머들과 소통해보세요</p>
      </div>

      {branchId && <p>선택된 지점 : {branchId}</p>}

      <CommuList branchId={branchId} />
    </div>
  );
}

export default CommuPostPage;