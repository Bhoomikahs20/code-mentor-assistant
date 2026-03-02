import React from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Avatar, Chip,
    LinearProgress, Button, Divider,
} from '@mui/material';
import { GitHub as GithubIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    console.log('Rendering Profile page');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <PageContainer maxWidth="md">
                <LinearProgress />
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="md">
            <Typography variant="h5" fontWeight={800} gutterBottom>
                👤 Profile
            </Typography>

            <Grid container spacing={3}>
                {/* Left: Avatar + Info */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 96,
                                    height: 96,
                                    bgcolor: 'primary.main',
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    mx: 'auto',
                                    mb: 2,
                                    boxShadow: '0 4px 16px rgba(25,118,210,0.3)',
                                }}
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6" fontWeight={800}>{user?.name}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{user?.college}</Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>{user?.email}</Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Placement Score */}
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2" fontWeight={600}>Placement Readiness</Typography>
                                    <Typography variant="body2" fontWeight={700} color="primary.main">
                                        {user?.placement_readiness ?? user?.placementReadiness ?? 0}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(user?.placement_readiness ?? user?.placementReadiness ?? 0, 100)}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>

                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<GithubIcon />}
                                sx={{ mb: 1 }}
                            >
                                Connect GitHub
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Badges, Skills, Stats */}
                <Grid item xs={12} md={8}>
                    {/* Badges */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <TrophyIcon sx={{ color: '#ff9800' }} />
                                <Typography variant="h6" fontWeight={700}>Badges Earned</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {(user?.badges || ['First Submission 🎯', 'Streak Starter 🔥', 'Bug Hunter 🐛']).map((badge, i) => (
                                    <Chip key={badge} label={badge} size="small"
                                        sx={{ bgcolor: ['#e3f2fd', '#fff8e1', '#e8f5e9', '#fce4ec'][i % 4], fontWeight: 600 }} />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Skill Mastery */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>🧠 Skill Mastery</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                {(user?.skills || ['Python', 'Data Structures', 'Algorithms', 'JavaScript']).map((skill) => (
                                    <Chip key={skill} label={skill} variant="outlined" sx={{ fontWeight: 600 }} />
                                ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            {[
                                { skill: 'Python', level: 78 },
                                { skill: 'Data Structures', level: 62 },
                                { skill: 'Algorithms', level: 55 },
                                { skill: 'JavaScript', level: 70 },
                            ].map((item) => (
                                <Box key={item.skill} sx={{ mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" fontWeight={600}>{item.skill}</Typography>
                                        <Typography variant="body2" color="text.secondary">{item.level}%</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.level}
                                        sx={{ height: 6, borderRadius: 4, bgcolor: '#e3f2fd', '& .MuiLinearProgress-bar': { borderRadius: 4 } }}
                                    />
                                </Box>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Grid container spacing={2}>
                        {[
                            { label: 'Skill Level', value: user?.skill_level || 'beginner', emoji: '⭐' },
                            { label: 'Goal', value: user?.goal || 'placement', emoji: '🎯' },
                            { label: 'Streak', value: `${user?.streak ?? 0} days`, emoji: '🔥' },
                            { label: 'College', value: user?.college || '—', emoji: '🏫' },
                        ].map((stat) => (
                            <Grid item xs={6} key={stat.label}>
                                <Card sx={{ textAlign: 'center' }}>
                                    <CardContent sx={{ py: 2, px: 1.5 }}>
                                        <Typography sx={{ fontSize: '1.5rem' }}>{stat.emoji}</Typography>
                                        <Typography variant="h6" fontWeight={800}>{stat.value}</Typography>
                                        <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </PageContainer>
    );
}
