import { useLocation, Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const RequireAuth = ({ allowedRole }) => {
    //const { auth } = useAuth();
    const location = useLocation();

    const authToken = localStorage.getItem('authToken');

    const decoded = jwt_decode(authToken);

    return (
        // If no user is logged in reroute them to the login page and update their location history
        //auth?.role === allowedRole ? <Outlet /> : <Navigate to='/' state={{ from: location }} replace />
        decoded.Role === allowedRole ? <Outlet /> : <Navigate to='/' state={{ from: location }} replace />
    );
}

export default RequireAuth;

