import { useGetPingQuery } from '../store/features/api/apiSlice';

function Home() {
  const { data, isSuccess } = useGetPingQuery();
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {isSuccess ? JSON.stringify(data) : null}
    </div>
  );
}

export default Home;
