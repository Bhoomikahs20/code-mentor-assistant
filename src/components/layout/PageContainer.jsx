import React from 'react';
import { Container, Box } from '@mui/material';

export default function PageContainer({ children, maxWidth = 'lg', sx = {} }) {
    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: { xs: 10, md: 4 } }}>
            <Container maxWidth={maxWidth} sx={{ py: { xs: 2, md: 4 }, ...sx }}>
                <Box className="fade-in">{children}</Box>
            </Container>
        </Box>
    );
}
