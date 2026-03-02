import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export default function ActivityGraph() {
    const { activityData } = useApp();

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    📊 Weekly Activity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Submissions and fixes this week
                </Typography>
                <Box sx={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12, fontFamily: 'Inter' }} />
                            <YAxis tick={{ fontSize: 12, fontFamily: 'Inter' }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 8,
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    fontFamily: 'Inter',
                                }}
                            />
                            <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }} />
                            <Bar dataKey="submissions" name="Submissions" fill="#1976d2" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="fixes" name="Fixes" fill="#ff9800" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
