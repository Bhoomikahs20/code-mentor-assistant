import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import {
    Whatshot as FireIcon,
    Code as CodeIcon,
    SportsEsports as GameIcon,
    TrendingUp as TrendIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import AnimatedCounter from '../common/AnimatedCounter';

const statDefs = [
    {
        key: 'streak',
        label: 'Day Streak',
        icon: <FireIcon />,
        color: '#ff5722',
        bg: '#fbe9e7',
        suffix: ' days',
    },
    {
        key: 'totalSubmissions',
        label: 'Total Submissions',
        icon: <CodeIcon />,
        color: '#1976d2',
        bg: '#e3f2fd',
        suffix: '',
    },
    {
        key: 'gamesPlayed',
        label: 'Games Played',
        icon: <GameIcon />,
        color: '#7c4dff',
        bg: '#ede7f6',
        suffix: '',
    },
    {
        key: 'improvementPercent',
        label: 'Improvement',
        icon: <TrendIcon />,
        color: '#2e7d32',
        bg: '#e8f5e9',
        suffix: '%',
    },
];

export default function StatsCards() {
    const { user } = useApp();

    return (
        <Grid container spacing={2}>
            {statDefs.map((stat) => (
                <Grid item xs={6} md={3} key={stat.key}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            '&:hover': { transform: 'translateY(-4px)' },
                            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Avatar sx={{ bgcolor: stat.bg, width: 44, height: 44, mb: 1.5 }}>
                                <Box sx={{ color: stat.color, display: 'flex', alignItems: 'center' }}>
                                    {stat.icon}
                                </Box>
                            </Avatar>
                            <AnimatedCounter
                                target={user?.[stat.key] || 0}
                                suffix={stat.suffix}
                                sx={{ fontSize: '1.75rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                                {stat.label}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
