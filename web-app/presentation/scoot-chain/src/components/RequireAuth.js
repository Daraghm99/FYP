import { useLocation, Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const RequireAuth = ({ allowedRole }) => {

    const location = useLocation();

    const authToken = localStorage.getItem('authToken');

    // Decode the JSON Web Token
    const decoded = jwt_decode(authToken);

    return (
        // If the user doesnt have the required role then reroute them to the login screen
        decoded.Role === allowedRole ? <Outlet /> : <Navigate to='/' state={{ from: location }} replace />
    );
}

export default RequireAuth;

