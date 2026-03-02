import { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Drawer, List, ListItemButton, ListItemText, Divider,
} from '@mui/material';
import { Code, Menu as MenuIcon, Close } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const LINKS = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
];

const GRAD = 'linear-gradient(90deg, #10b981, #3b82f6)';

function scrollTo(id) {
    const el = document.getElementById(id.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function PublicNavbar() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, gap: 2 }}>
                    {/* Mobile menu */}
                    <IconButton sx={{ display: { md: 'none' } }} onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>

                    {/* Logo */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mr: 4 }}
                    >
                        <Box sx={{
                            width: 34, height: 34, borderRadius: '10px',
                            background: GRAD,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Code sx={{ color: '#fff', fontSize: 18 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', display: { xs: 'none', sm: 'block' } }}>
                            CodeMentor AI
                        </Typography>
                    </Box>

                    {/* Desktop links */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
                        {LINKS.map(({ label, href }) => (
                            <Button
                                key={label}
                                onClick={() => scrollTo(href)}
                                sx={{
                                    color: '#475569', fontWeight: 500, fontSize: '0.9rem',
                                    textTransform: 'none', px: 1.5,
                                    '&:hover': { color: '#10b981', bgcolor: '#f0fdf4' },
                                    borderRadius: '8px',
                                    transition: 'all .15s',
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
                        <Button
                            onClick={() => navigate('/login')}
                            sx={{
                                color: '#475569', fontWeight: 600, textTransform: 'none', px: 2,
                                border: '1px solid #e2e8f0', borderRadius: '10px',
                                '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => navigate('/register')}
                            sx={{
                                background: GRAD, color: '#fff', fontWeight: 700,
                                textTransform: 'none', px: 2.5, borderRadius: '10px',
                                boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
                                '&:hover': { opacity: 0.92 },
                                display: { xs: 'none', sm: 'flex' },
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 260, pt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>CodeMentor AI</Typography>
                        <IconButton size="small" onClick={() => setDrawerOpen(false)}><Close /></IconButton>
                    </Box>
                    <Divider />
                    <List>
                        {LINKS.map(({ label, href }) => (
                            <ListItemButton key={label} onClick={() => { scrollTo(href); setDrawerOpen(false); }}>
                                <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 600, color: '#0f172a' }} />
                            </ListItemButton>
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Button fullWidth variant="outlined" onClick={() => { navigate('/login'); setDrawerOpen(false); }}
                                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
                                Login
                            </Button>
                            <Button fullWidth onClick={() => { navigate('/register'); setDrawerOpen(false); }}
                                sx={{ background: GRAD, color: '#fff', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                                Get Started
                            </Button>
                        </Box>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
