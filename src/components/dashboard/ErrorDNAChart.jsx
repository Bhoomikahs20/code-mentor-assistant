import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Tooltip } from '@mui/material';
import { useApp } from '../../context/AppContext';

export default function ErrorDNAChart() {
    const { errorDNA } = useApp();

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    🧬 Error DNA
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Your most common coding patterns
                </Typography>

                {/* Center Ring Visualization */}
                <Box
                    sx={{
                        position: 'relative',
                        width: 160,
                        height: 160,
                        mx: 'auto',
                        mb: 3,
                    }}
                >
                    <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        {errorDNA.map((item, i) => {
                            const radius = 68;
                            const circumference = 2 * Math.PI * radius;
                            const offset = errorDNA.slice(0, i).reduce((sum, e) => sum + e.percent, 0);
                            const dasharray = (item.percent / 100) * circumference;
                            const dashoffset = (offset / 100) * circumference;
                            return (
                                <circle
                                    key={item.type}
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    fill="none"
                                    stroke={item.color}
                                    strokeWidth="20"
                                    strokeDasharray={`${dasharray} ${circumference - dasharray}`}
                                    strokeDashoffset={-dashoffset}
                                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                                />
                            );
                        })}
                        <circle cx="80" cy="80" r="50" fill="white" />
                    </svg>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h5" fontWeight={800} color="primary.main">
                            {errorDNA.reduce((s, e) => s + e.count, 0)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Total
                        </Typography>
                    </Box>
                </Box>

                {/* Error Type List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {errorDNA.map((item) => (
                        <Box key={item.type}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            bgcolor: item.color,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography variant="body2" fontWeight={600}>
                                        {item.type}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                    {item.count} ({item.percent}%)
                                </Typography>
                            </Box>
                            <Tooltip title={`${item.percent}%`} placement="top">
                                <LinearProgress
                                    variant="determinate"
                                    value={item.percent}
                                    sx={{
                                        height: 6,
                                        borderRadius: 4,
                                        bgcolor: `${item.color}22`,
                                        '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 4 },
                                    }}
                                />
                            </Tooltip>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
