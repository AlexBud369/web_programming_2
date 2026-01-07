import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;