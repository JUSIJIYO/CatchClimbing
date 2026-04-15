import React from 'react';
import { useSearchParams } from 'react-router-dom';
import BranchCommuList from '../../components/branch/BranchCommuList';

function CommuPostPage() {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get('branch');

  return (
    <div>
      <h1>전체 커뮤니티</h1>

      {/* 나중에 필터 ui 넣어야댐!!!! */}
      {branchId && <p>선택된 지점 : {branchId} </p>}

      <BranchCommuList branchId={branchId} />
    </div>
  );
}

export default CommuPostPage;
