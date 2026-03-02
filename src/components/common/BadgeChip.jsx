import React from 'react';
import { Chip } from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    Whatshot as FireIcon,
    Star as StarIcon,
    CheckCircle as CheckIcon,
    Lock as LockIcon,
} from '@mui/icons-material';

const badgeConfig = {
    trophy: { icon: <TrophyIcon sx={{ fontSize: 14 }} />, color: '#ff9800', bg: '#fff3e0' },
    fire: { icon: <FireIcon sx={{ fontSize: 14 }} />, color: '#ff5722', bg: '#fbe9e7' },
    star: { icon: <StarIcon sx={{ fontSize: 14 }} />, color: '#7c4dff', bg: '#ede7f6' },
    check: { icon: <CheckIcon sx={{ fontSize: 14 }} />, color: '#2e7d32', bg: '#e8f5e9' },
    lock: { icon: <LockIcon sx={{ fontSize: 14 }} />, color: '#546e7a', bg: '#eceff1' },
};

export default function BadgeChip({ label, variant = 'star', size = 'small', sx = {} }) {
    const config = badgeConfig[variant] || badgeConfig.star;
    return (
        <Chip
            icon={config.icon}
            label={label}
            size={size}
            sx={{
                bgcolor: config.bg,
                color: config.color,
                fontWeight: 600,
                border: 'none',
                '& .MuiChip-icon': { color: `${config.color} !important` },
                ...sx,
            }}
        />
    );
}
