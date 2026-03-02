import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import PublicNavbar from '../components/layout/PublicNavbar';

export default function PublicLayout() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
            <PublicNavbar />
            <Outlet />
        </Box>
    );
}
