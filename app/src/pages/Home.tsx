import { Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

import { useGetPingQuery } from '../store/features/api/apiSlice';
import { login, logout } from '../store/features/user/userSlice';

function Home() {
  const dispatch = useDispatch();

  function userLogout() {
    dispatch(logout());
  }

  function userLogin() {
    dispatch(login());
  }

  const { data, isSuccess } = useGetPingQuery();
  return (
    <div>
      <Button onClick={userLogin}>Login</Button>
      <Button onClick={userLogout}>Logout</Button>
      {isSuccess ? JSON.stringify(data) : null}
    </div>
  );
}

export default Home;
