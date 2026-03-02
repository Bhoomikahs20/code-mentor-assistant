import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    LinearProgress,
} from '@mui/material';
import { PlayArrow as PlayIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function DifficultyBar({ difficulty }) {
    const levels = { Easy: 33, Medium: 66, Hard: 100 };
    const colors = { Easy: '#66bb6a', Medium: '#ff9800', Hard: '#ef5350' };
    const val = levels[difficulty] || 50;
    const color = colors[difficulty] || '#1976d2';
    return (
        <LinearProgress
            variant="determinate"
            value={val}
            sx={{
                height: 4,
                borderRadius: 4,
                bgcolor: `${color}22`,
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
            }}
        />
    );
}

export default function GameCard({ game }) {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
                '&:hover': { transform: 'translateY(-6px)' },
                transition: 'transform 0.25s ease, box-shadow 0.3s ease',
            }}
        >
            {/* Color accent top bar */}
            <Box sx={{ height: 4, bgcolor: game.color, borderRadius: '12px 12px 0 0' }} />

            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{game.icon}</Typography>
                    <Chip
                        label={game.difficulty}
                        size="small"
                        sx={{
                            bgcolor:
                                game.difficulty === 'Easy' ? '#e8f5e9'
                                    : game.difficulty === 'Medium' ? '#fff3e0'
                                        : '#ffebee',
                            color:
                                game.difficulty === 'Easy' ? '#2e7d32'
                                    : game.difficulty === 'Medium' ? '#e65100'
                                        : '#c62828',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                        }}
                    />
                </Box>

                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: '1rem' }}>
                    {game.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {game.description}
                </Typography>

                <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                        <Typography variant="caption" color="text.secondary">{game.difficulty}</Typography>
                    </Box>
                    <DifficultyBar difficulty={game.difficulty} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TrophyIcon sx={{ fontSize: 14, color: '#ff9800' }} />
                        <Typography variant="caption" fontWeight={700}>
                            Best: {game.bestScore.toLocaleString()}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {game.players} players
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayIcon />}
                    onClick={() => navigate('/games')}
                    sx={{ bgcolor: game.color, '&:hover': { bgcolor: game.color, filter: 'brightness(0.9)' } }}
                >
                    Play Now
                </Button>
            </CardContent>
        </Card>
    );
}
