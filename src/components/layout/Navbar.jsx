import { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Avatar, Menu, MenuItem, Chip, Drawer, List, ListItemButton,
    ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import {
    Code as CodeIcon,
    Dashboard as DashboardIcon,
    Map as MapIcon,
    SportsEsports as GameIcon,
    EmojiEvents as TrophyIcon,
    Person as PersonIcon,
    Analytics as AnalyticsIcon,
    Menu as MenuIcon,
    Whatshot as FireIcon,
    Logout as LogoutIcon,
    Login as LoginIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GRAD = 'linear-gradient(90deg, #10b981, #3b82f6)';

const navLinks = [
    { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Submit Code', to: '/submit', icon: <CodeIcon /> },
    { label: 'Roadmap', to: '/roadmap', icon: <MapIcon /> },
    { label: 'Games', to: '/games', icon: <GameIcon /> },
    { label: 'Leaderboard', to: '/leaderboard', icon: <TrophyIcon /> },
    { label: 'Analytics', to: '/analytics', icon: <AnalyticsIcon /> },
];

export default function Navbar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isAuthenticated = !!user;

    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
        navigate('/');
    };

    const isActive = (to) => location.pathname === to;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{ bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}
        >
            <Toolbar sx={{ maxWidth: 1280, mx: 'auto', width: '100%', px: { xs: 2, md: 3 }, gap: 1 }}>
                {isMobile && isAuthenticated && (
                    <IconButton onClick={() => setDrawerOpen(true)} edge="start" size="small">
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Logo */}
                <Box
                    component={Link} to={isAuthenticated ? '/dashboard' : '/'}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mr: 3 }}
                >
                    <Box sx={{
                        width: 32, height: 32, borderRadius: '9px',
                        background: GRAD,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <CodeIcon sx={{ color: '#fff', fontSize: 17 }} />
                    </Box>
                    <Typography sx={{
                        fontWeight: 800, color: '#0f172a', fontSize: '0.95rem',
                        display: { xs: 'none', sm: 'block' },
                    }}>
                        CodeMentor <Box component="span" sx={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</Box>
                    </Typography>
                </Box>

                {/* Desktop nav links (authenticated only) */}
                {!isMobile && isAuthenticated && (
                    <Box sx={{ display: 'flex', gap: 0.25, flexGrow: 1 }}>
                        {navLinks.map(({ label, to }) => (
                            <Button
                                key={to}
                                component={Link}
                                to={to}
                                size="small"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: isActive(to) ? 700 : 500,
                                    fontSize: '0.875rem',
                                    color: isActive(to) ? '#10b981' : '#475569',
                                    borderBottom: isActive(to) ? '2px solid #10b981' : '2px solid transparent',
                                    borderRadius: 0,
                                    px: 1.5, py: 1,
                                    '&:hover': { color: '#10b981', bgcolor: '#f0fdf4' },
                                    transition: 'all .15s',
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                )}

                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* Streak badge */}
                    {isAuthenticated && !isMobile && (
                        <Chip
                            icon={<FireIcon sx={{ color: '#f97316 !important', fontSize: 15 }} />}
                            label={`${user?.streak ?? 0}d streak`}
                            size="small"
                            sx={{ bgcolor: '#fff7ed', color: '#c2410c', fontWeight: 700, fontSize: 12, border: '1px solid #fed7aa' }}
                        />
                    )}

                    {/* Auth controls */}
                    {isAuthenticated ? (
                        <>
                            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                                <Avatar sx={{ width: 34, height: 34, background: GRAD, fontSize: 14, fontWeight: 700 }}>
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', minWidth: 180 } }}
                            >
                                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                                    <Box>
                                        <Typography fontWeight={700} fontSize={14} color="#0f172a">{user?.name}</Typography>
                                        <Typography fontSize={12} color="#64748b">{user?.email}</Typography>
                                    </Box>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
                                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                                    <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            component={Link}
                            to="/login"
                            size="small"
                            startIcon={<LoginIcon />}
                            sx={{
                                background: GRAD, color: '#fff', fontWeight: 700,
                                textTransform: 'none', borderRadius: '10px', px: 2,
                                '&:hover': { opacity: 0.9 },
                            }}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 260, pt: 2 }}>
                    <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CodeIcon sx={{ color: '#fff', fontSize: 17 }} />
                        </Box>
                        <Typography fontWeight={800} color="#0f172a">CodeMentor AI</Typography>
                    </Box>
                    <Divider />
                    <List dense>
                        {navLinks.map(({ label, to, icon }) => (
                            <ListItemButton
                                key={to}
                                component={Link}
                                to={to}
                                selected={isActive(to)}
                                onClick={() => setDrawerOpen(false)}
                                sx={{
                                    borderRadius: 2, mx: 1, mb: 0.5,
                                    '&.Mui-selected': { bgcolor: '#f0fdf4', color: '#10b981' },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36, color: isActive(to) ? '#10b981' : 'inherit' }}>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText primary={label} primaryTypographyProps={{ fontWeight: isActive(to) ? 700 : 500, fontSize: 14 }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}
