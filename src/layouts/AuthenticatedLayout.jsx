import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AuthNavbar from '../components/layout/Navbar';

export default function AuthenticatedLayout() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <AuthNavbar />
            <Outlet />
        </Box>
    );
}
