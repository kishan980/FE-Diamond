import GuestGuard from 'utils/route-guard/GuestGuard';
import Login from 'views/authentication/Login';

const Landing = () => (
  <GuestGuard>
    <Login />
  </GuestGuard>
);

export default Landing;
