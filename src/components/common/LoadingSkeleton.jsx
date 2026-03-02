import React from 'react';
import { Skeleton, Box, Card, CardContent } from '@mui/material';

export function StatCardSkeleton() {
    return (
        <Card>
            <CardContent>
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="80%" />
            </CardContent>
        </Card>
    );
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <Box>
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={56} sx={{ mb: 1, borderRadius: 2 }} />
            ))}
        </Box>
    );
}

export function CardSkeleton({ height = 200 }) {
    return <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 3 }} />;
}

export default function LoadingSkeleton() {
    return (
        <Box>
            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
        </Box>
    );
}
