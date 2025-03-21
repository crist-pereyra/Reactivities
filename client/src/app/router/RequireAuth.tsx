import { useAccount } from '@/lib/hooks/useAccount';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RequireAuth = () => {
  const { currentUser, isLoadingUserInfo } = useAccount();
  const location = useLocation();

  if (isLoadingUserInfo) return <></>;
  if (!currentUser)
    return <Navigate to='/login' state={{ from: location }} replace />;
  return <Outlet />;
};
