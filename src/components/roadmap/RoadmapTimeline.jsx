import React, { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Typography,
    Button,
    Chip,
    Drawer,
    Card,
    CardContent,
    Divider,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    RadioButtonChecked as CurrentIcon,
    Lock as LockIcon,
    AccessTime as ClockIcon,
    Code as CodeIcon,
    SportsEsports as GameIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const stepIcons = {
    completed: <CheckIcon sx={{ color: '#2e7d32' }} />,
    current: <CurrentIcon sx={{ color: '#1976d2' }} />,
    locked: <LockIcon sx={{ color: '#b0bec5' }} />,
};

export default function RoadmapTimeline() {
    const { roadmap } = useApp();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedStep, setSelectedStep] = useState(null);

    const activeStep = roadmap.findIndex((s) => s.status === 'current');

    return (
        <Box>
            <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
                {roadmap.map((step, index) => (
                    <Step key={step.id} completed={step.status === 'completed'}>
                        <StepLabel
                            StepIconComponent={() => stepIcons[step.status]}
                            optional={
                                <Chip
                                    label={step.status === 'completed' ? 'Done' : step.status === 'current' ? 'In Progress' : 'Locked'}
                                    size="small"
                                    sx={{
                                        bgcolor:
                                            step.status === 'completed' ? '#e8f5e9'
                                                : step.status === 'current' ? '#e3f2fd'
                                                    : '#eceff1',
                                        color:
                                            step.status === 'completed' ? '#2e7d32'
                                                : step.status === 'current' ? '#1565c0'
                                                    : '#546e7a',
                                        fontWeight: 700,
                                        fontSize: '0.65rem',
                                        height: 20,
                                    }}
                                />
                            }
                            sx={{
                                cursor: step.status !== 'locked' ? 'pointer' : 'default',
                                '& .MuiStepLabel-label': {
                                    fontWeight: step.status === 'current' ? 700 : 500,
                                    color:
                                        step.status === 'locked' ? 'text.disabled' : 'text.primary',
                                    fontSize: '1rem',
                                },
                            }}
                            onClick={() => step.status !== 'locked' && setSelectedStep(step)}
                        >
                            {step.title}
                        </StepLabel>
                        <StepContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {step.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    icon={<ClockIcon sx={{ fontSize: 14 }} />}
                                    label={step.time}
                                    size="small"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<CodeIcon sx={{ fontSize: 14 }} />}
                                    label={`${step.problems} problems`}
                                    size="small"
                                    variant="outlined"
                                />
                                {step.status !== 'locked' && (
                                    <Button size="small" variant="contained" onClick={() => setSelectedStep(step)}>
                                        View Details
                                    </Button>
                                )}
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>

            {/* Detail Drawer */}
            <Drawer
                anchor={isMobile ? 'bottom' : 'right'}
                open={Boolean(selectedStep)}
                onClose={() => setSelectedStep(null)}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100%' : 380,
                        maxHeight: isMobile ? '80vh' : '100vh',
                        borderRadius: isMobile ? '16px 16px 0 0' : 0,
                        p: 3,
                    },
                }}
            >
                {selectedStep && (
                    <Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            {selectedStep.title}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip icon={<ClockIcon sx={{ fontSize: 14 }} />} label={selectedStep.time} size="small" variant="outlined" />
                            <Chip icon={<CodeIcon sx={{ fontSize: 14 }} />} label={`${selectedStep.problems} problems`} size="small" variant="outlined" />
                        </Box>

                        <Card sx={{ bgcolor: '#e3f2fd', mb: 2 }} elevation={0}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Typography variant="subtitle2" fontWeight={700} color="primary.main" gutterBottom>
                                    💡 Why You Need This
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Mastering {selectedStep.title} is essential for cracking technical interviews at top companies.
                                    This module builds the foundation for advanced topics.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                            Topics Covered
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 3 }}>
                            {['Arrays', 'Strings', 'Sorting', 'Recursion'].map((t) => (
                                <Chip key={t} label={t} size="small" variant="outlined" />
                            ))}
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mb: 1 }}
                            onClick={() => navigate('/submit')}
                        >
                            Start Practice Problems
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GameIcon />}
                            onClick={() => navigate('/games')}
                        >
                            Play Related Game
                        </Button>
                    </Box>
                )}
            </Drawer>
        </Box>
    );
}
