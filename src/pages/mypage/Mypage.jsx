import { auth } from '../../firebase/config';
import ProfileCard from '../../components/mypage/ProfileCard';

function Mypage() {
  const user = auth.currentUser;

  return (
    <div>
      <ProfileCard user={user} />
    </div>
  );
}

export default Mypage;
