import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Tabs,
    Tab,
    Typography,
    Chip,
    CircularProgress,
    Divider,
    Button,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import {
    AutoAwesome as AIIcon,
    BugReport as BugIcon,
    Lightbulb as TipIcon,
    School as LearnIcon,
    Biotech as DNAIcon,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

function TypingAnimation() {
    return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', py: 1 }}>
            <AIIcon sx={{ fontSize: 18, color: 'primary.main', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                AI is analyzing your code
            </Typography>
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        animation: `typingDot 1.4s ease ${i * 0.2}s infinite`,
                    }}
                />
            ))}
        </Box>
    );
}

const TabPanel = ({ children, value, index }) =>
    value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;

export default function FeedbackPanel() {
    const { feedbackLoading, currentFeedback } = useApp();
    const [tab, setTab] = useState(0);
    const [expLang, setExpLang] = useState('English');

    if (feedbackLoading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                    <CircularProgress size={48} sx={{ mb: 2 }} />
                    <TypingAnimation />
                </CardContent>
            </Card>
        );
    }

    if (!currentFeedback) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, textAlign: 'center' }}>
                    <AIIcon sx={{ fontSize: 56, color: 'primary.light', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" fontWeight={600} color="text.secondary">
                        Submit your code to get AI feedback
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Our AI mentor will analyze your code, spot bugs, and teach you concepts
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                        🤖 AI Feedback
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                            label={`${currentFeedback.confidence}% Confident`}
                            size="small"
                            sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }}
                        />
                        <FormControl size="small">
                            <Select
                                value={expLang}
                                onChange={(e) => setExpLang(e.target.value)}
                                sx={{ fontSize: '0.8rem', minWidth: 100 }}
                            >
                                {['English', 'Hindi', 'Kannada'].map((l) => (
                                    <MenuItem key={l} value={l} sx={{ fontSize: '0.8rem' }}>{l}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <Tab label="Explanation" icon={<TipIcon sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 40, fontSize: '0.8rem' }} />
                    <Tab label="Fix" icon={<BugIcon sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 40, fontSize: '0.8rem' }} />
                    <Tab label="Error DNA" icon={<DNAIcon sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 40, fontSize: '0.8rem' }} />
                    <Tab label="Learn" icon={<LearnIcon sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 40, fontSize: '0.8rem' }} />
                </Tabs>

                <TabPanel value={tab} index={0}>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {currentFeedback.explanation}
                    </Typography>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <Box sx={{ bgcolor: '#1e1e2e', borderRadius: 2, p: 2, fontFamily: 'monospace' }}>
                        <Typography variant="caption" sx={{ color: '#4fc3f7', display: 'block', mb: 1 }}>
                            # Optimized Solution
                        </Typography>
                        <Typography variant="body2" component="pre" sx={{ color: '#e2e8f0', fontSize: '0.8rem', overflow: 'auto', m: 0 }}>
                            {currentFeedback.fix}
                        </Typography>
                    </Box>
                </TabPanel>

                <TabPanel value={tab} index={2}>
                    <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2, borderLeft: '4px solid #ff9800' }}>
                        <Typography variant="body2" fontWeight={600} color="#e65100" gutterBottom>
                            Pattern Detected
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {currentFeedback.errorDNA}
                        </Typography>
                    </Box>
                </TabPanel>

                <TabPanel value={tab} index={3}>
                    <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, borderLeft: '4px solid #1976d2' }}>
                        <Typography variant="body2" fontWeight={600} color="primary.main" gutterBottom>
                            💡 Concept to Learn
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            {currentFeedback.concept}
                        </Typography>
                    </Box>
                    <Button variant="outlined" size="small" sx={{ mt: 2 }} fullWidth>
                        Practice This Concept →
                    </Button>
                </TabPanel>
            </CardContent>
        </Card>
    );
}
