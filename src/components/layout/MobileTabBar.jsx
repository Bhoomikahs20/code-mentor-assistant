import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from '@mui/material';
import {
    Home as HomeIcon,
    Code as CodeIcon,
    SportsEsports as GameIcon,
    TrendingUp as ProgressIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
    { label: 'Home', to: '/', icon: <HomeIcon /> },
    { label: 'Code', to: '/submit', icon: <CodeIcon /> },
    { label: 'Games', to: '/games', icon: <GameIcon /> },
    { label: 'Progress', to: '/dashboard', icon: <ProgressIcon /> },
    { label: 'Profile', to: '/profile', icon: <PersonIcon /> },
];

export default function MobileTabBar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    if (!isMobile) return null;

    const currentIndex = tabs.findIndex((t) => t.to === location.pathname);

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
                borderTop: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '16px 16px 0 0',
                overflow: 'hidden',
            }}
            elevation={4}
        >
            <BottomNavigation
                value={currentIndex >= 0 ? currentIndex : 0}
                onChange={(_, newValue) => navigate(tabs[newValue].to)}
                showLabels
                sx={{ height: 64 }}
            >
                {tabs.map((tab) => (
                    <BottomNavigationAction
                        key={tab.to}
                        label={tab.label}
                        icon={tab.icon}
                        sx={{
                            '&.Mui-selected': { color: 'primary.main' },
                            fontSize: '0.7rem',
                            minWidth: 0,
                        }}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
