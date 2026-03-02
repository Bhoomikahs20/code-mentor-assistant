import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
} from '@mui/material';
import { useApp } from '../../context/AppContext';

const statusColors = {
    Fixed: { bg: '#e8f5e9', color: '#2e7d32' },
    Reviewed: { bg: '#e3f2fd', color: '#1565c0' },
    Pending: { bg: '#fff3e0', color: '#e65100' },
};

const langColors = {
    Python: '#3776ab',
    JavaScript: '#f7df1e',
    Java: '#e76f00',
    'C++': '#044f88',
};

export default function RecentSubmissions() {
    const { submissions } = useApp();

    return (
        <Card>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    📝 Recent Submissions
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                                    PROBLEM
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                                    LANGUAGE
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                                    DATE
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                                    STATUS
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>
                                    SCORE
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {submissions.slice(0, 5).map((row) => {
                                const statusStyle = statusColors[row.status] || statusColors.Pending;
                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'primary.50' },
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {row.title}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.language}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${langColors[row.language] || '#888'}22`,
                                                    color: langColors[row.language] || '#888',
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {row.date}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                sx={{
                                                    bgcolor: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2" fontWeight={700} color="primary.main">
                                                    {row.score}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
