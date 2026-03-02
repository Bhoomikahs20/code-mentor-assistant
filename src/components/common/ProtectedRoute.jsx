import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — works in two modes:
 *  1. As a layout route parent (wrapping <AuthenticatedLayout />):
 *     <Route element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
 *        <Route path="..." element={<Page />} />
 *     </Route>
 *
 *  2. As a direct page wrapper:
 *     <ProtectedRoute><Dashboard /></ProtectedRoute>
 *
 * Loading → full-screen spinner
 * Not authenticated → redirect to /login
 * Authenticated → render children (or <Outlet /> if no children)
 */
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={40} sx={{ color: '#10b981' }} />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // When used as a layout route (wraps another layout without children), render Outlet
    return children ?? <Outlet />;
}
