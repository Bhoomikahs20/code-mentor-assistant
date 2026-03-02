import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

export default function AnimatedCounter({ target, duration = 1500, prefix = '', suffix = '', sx = {} }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);

    return (
        <Typography sx={{ animation: 'counterUp 0.5s ease', ...sx }}>
            {prefix}{count.toLocaleString()}{suffix}
        </Typography>
    );
}
