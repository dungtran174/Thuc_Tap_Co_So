import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isLoggedIn, isLoading } = useAuth();
  
  // Nếu đang tải dữ liệu, có thể hiển thị loading spinner
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu có yêu cầu về roles, kiểm tra quyền
  if (allowedRoles && allowedRoles.length > 0) {
    console.log('ProtectedRoute - User roles:', user?.roles);
    console.log('ProtectedRoute - Allowed roles:', allowedRoles);
    
    // Kiểm tra nếu user có ít nhất 1 role được phép
    const userRoles = user?.roles || [];
    const hasRequiredRole = allowedRoles.some(role => 
      userRoles.includes(role)
    );
    
    if (!hasRequiredRole) {
      console.log('ProtectedRoute - Access denied, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }
  
  // Nếu đã đăng nhập và có quyền, hiển thị children hoặc các route con
  return children ? children : <Outlet />;
};

export default ProtectedRoute;