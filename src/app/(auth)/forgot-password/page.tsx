import GuestGuard from 'utils/route-guard/GuestGuard';
import ForgotPassword from 'views/authentication/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <GuestGuard>
      <ForgotPassword />
    </GuestGuard>
  );
};

export default ForgotPasswordPage;
