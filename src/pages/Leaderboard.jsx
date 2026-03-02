import { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Avatar, Chip,
    Skeleton, Alert, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { EmojiEvents, LocalFireDepartment } from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

console.log('Rendering Leaderboard page');

// Static leaderboard for hackathon demo (no endpoint exists yet)
const STATIC_LEADERS = [
    { rank: 1, name: 'Priya Sharma', college: 'IIT Delhi', score: 4820, streak: 34, badge: '🏆' },
    { rank: 2, name: 'Rahul Gupta', college: 'NIT Trichy', score: 4410, streak: 28, badge: '🥈' },
    { rank: 3, name: 'Anjali Singh', college: 'VIT Vellore', score: 4150, streak: 22, badge: '🥉' },
    { rank: 4, name: 'Karan Mehta', college: 'IIT Bombay', score: 3890, streak: 19, badge: '' },
    { rank: 5, name: 'Sneha Patel', college: 'BITS Pilani', score: 3740, streak: 15, badge: '' },
    { rank: 6, name: 'Arjun Nair', college: 'PESIT Bangalore', score: 3620, streak: 12, badge: '' },
    { rank: 7, name: 'Deepika Rao', college: 'Manipal MIT', score: 3390, streak: 10, badge: '' },
    { rank: 8, name: 'Vikas Joshi', college: 'SRM University', score: 3200, streak: 8, badge: '' },
    { rank: 9, name: 'Meena Iyer', college: 'Anna University', score: 3050, streak: 7, badge: '' },
    { rank: 10, name: 'Ravi Krishnan', college: 'Amity Noida', score: 2910, streak: 6, badge: '' },
];

export default function Leaderboard() {
    console.log('Rendering Leaderboard page');
    const { user } = useAuth();
    const [loading] = useState(false);
    const [error] = useState('');

    if (!user) {
        return (
            <PageContainer>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            </PageContainer>
        );
    }

    const myRank = STATIC_LEADERS.findIndex((l) => l.name === user?.name);
    const myEntry = myRank >= 0 ? STATIC_LEADERS[myRank] : null;

    return (
        <PageContainer maxWidth="md">
            <Typography variant="h5" fontWeight={800} gutterBottom>🏆 Leaderboard</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Top performers this month — keep coding to climb the ranks!
            </Typography>

            {/* Top 3 Podium */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2, mb: 5 }}>
                {[STATIC_LEADERS[1], STATIC_LEADERS[0], STATIC_LEADERS[2]].map((leader, pos) => {
                    const heights = [140, 180, 120];
                    const colors = ['#90a4ae', '#ffd700', '#cd7f32'];
                    return (
                        <Box key={leader.rank} sx={{ textAlign: 'center' }}>
                            <Avatar sx={{ width: 52, height: 52, bgcolor: colors[pos], mx: 'auto', mb: 1, fontSize: 20, fontWeight: 700 }}>
                                {leader.name[0]}
                            </Avatar>
                            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>{leader.name.split(' ')[0]}</Typography>
                            <Typography variant="caption" color="text.secondary">{leader.score} pts</Typography>
                            <Box sx={{
                                width: 80, height: heights[pos], bgcolor: colors[pos],
                                borderRadius: '8px 8px 0 0', mt: 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Typography fontSize={pos === 1 ? 32 : 24}>{leader.badge || `#${leader.rank}`}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Full Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>College</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Score</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                <LocalFireDepartment sx={{ color: '#ff5722', fontSize: 18, verticalAlign: 'middle' }} /> Streak
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {STATIC_LEADERS.map((leader) => {
                            const isMe = leader.name === user?.name;
                            return (
                                <TableRow key={leader.rank}
                                    sx={{ bgcolor: isMe ? '#e3f2fd' : 'inherit', fontWeight: isMe ? 700 : 400 }}>
                                    <TableCell>
                                        <Chip label={`${leader.badge || '#' + leader.rank}`}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                bgcolor: leader.rank <= 3 ? '#fff8e1' : '#f5f5f5',
                                                color: leader.rank <= 3 ? '#e65100' : 'inherit',
                                            }} />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
                                                {leader.name[0]}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight={isMe ? 700 : 400}>
                                                {leader.name} {isMe && <Chip label="You" size="small" color="primary" sx={{ ml: 0.5, height: 18 }} />}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{leader.college}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight={700} color="primary.main">{leader.score}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip label={`🔥 ${leader.streak}d`} size="small"
                                            sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600 }} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </PageContainer>
    );
}
