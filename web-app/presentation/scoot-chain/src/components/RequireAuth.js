import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ allowedRole }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        // If no user is logged in reroute them to the login page and update their location history
        auth?.role === allowedRole ? <Outlet /> : <Navigate to='/' state={{ from: location }} replace />
    );
}

export default RequireAuth;

