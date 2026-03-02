import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box, Grid, Typography, Button, Card, CardContent,
    Chip, List, ListItemButton, ListItemText, ListItemIcon,
    Alert, CircularProgress, Select, MenuItem, FormControl,
    InputLabel, TextField, Divider, LinearProgress,
    Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import {
    Send as SendIcon, Code as CodeIcon, ExpandMore,
    CheckCircle, Error as ErrorIcon, HourglassEmpty,
} from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

console.log('Rendering CodeSubmit page');

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const LANGUAGES = ['python', 'javascript', 'java', 'c', 'cpp'];

const SAMPLE_CODE = {
    python: `def find_max(nums):
    max_val = 0
    for i in range(len(nums) + 1):  # Bug: off-by-one
        if nums[i] > max_val:
            max_val = nums[i]
    return max_val

print(find_max([3, 1, 4, 1, 5, 9, 2, 6]))`,
    javascript: `function reverseString(str) {
  let result = '';
  for (let i = str.length; i >= 0; i--) {  // Bug: off-by-one
    result += str[i];
  }
  return result;
}
console.log(reverseString("hello"));`,
};

export default function CodeSubmit() {
    console.log('Rendering CodeSubmit page');
    const { user, token } = useAuth();
    const location = useLocation();
    const incoming = location.state || {};

    const [code, setCode] = useState(incoming.sampleCode || '');
    const [language, setLanguage] = useState('python');
    const [problem, setProblem] = useState(incoming.hint || '');
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [history, setHistory] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [polling, setPolling] = useState(false);
    const [error, setError] = useState('');
    const pollRef = useRef(null);

    // Load submission history
    useEffect(() => {
        if (!user?.id) return;
        axios.get(`${API_BASE}/api/code/history/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(({ data }) => setHistory(data.submissions || [])).catch(() => { });
    }, [user]);

    // Poll for job completion
    useEffect(() => {
        if (!jobId || status === 'completed' || status === 'failed') return;
        setPolling(true);
        pollRef.current = setInterval(async () => {
            try {
                const { data } = await axios.get(`${API_BASE}/api/code/status/${jobId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStatus(data.status);
                if (data.status === 'completed' || data.status === 'failed') {
                    clearInterval(pollRef.current);
                    setPolling(false);
                    if (data.status === 'completed') {
                        const fb = await axios.get(`${API_BASE}/api/feedback/${jobId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setFeedback(fb.data.feedback);
                    }
                    // Refresh history
                    const hist = await axios.get(`${API_BASE}/api/code/history/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setHistory(hist.data.submissions || []);
                }
            } catch (err) {
                console.error('Polling error:', err);
                clearInterval(pollRef.current);
                setPolling(false);
            }
        }, 2000);
        return () => clearInterval(pollRef.current);
    }, [jobId, status]);

    const handleSubmit = async () => {
        if (!code.trim()) { setError('Please paste some code first.'); return; }
        if (!user?.id) { setError('You must be logged in to submit.'); return; }
        setError('');
        setFeedback(null);
        setJobId(null);
        setStatus('');
        setSubmitting(true);
        try {
            const { data } = await axios.post(`${API_BASE}/api/code/submit`, {
                user_id: user.id,
                code,
                language,
                problem_description: problem,
            }, { headers: { Authorization: `Bearer ${token}` } });
            setJobId(data.job_id);
            setStatus(data.status);
        } catch (err) {
            console.error('Submit error:', err);
            setError(err?.response?.data?.detail || 'Submission failed. Is the backend running?');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <PageContainer maxWidth="xl">
                <LinearProgress />
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="xl">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={800}>💻 Submit Code</Typography>
                <Typography variant="body2" color="text.secondary">
                    Paste your code and get instant AI-powered feedback
                </Typography>
            </Box>

            {/* Topic context banner from Roadmap */}
            {incoming.topicName && (
                <Box sx={{
                    mb: 3, p: 2, borderRadius: 2,
                    bgcolor: '#f0fdf4', border: '1px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', gap: 2,
                }}>
                    <Box sx={{ fontSize: 24 }}>🎯</Box>
                    <Box>
                        <Typography sx={{ fontWeight: 700, color: '#065f46', fontSize: 14 }}>
                            Practice Topic: {incoming.topicName}
                        </Typography>
                        {incoming.hint && (
                            <Typography sx={{ color: '#047857', fontSize: 13 }}>
                                Hint: {incoming.hint}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}

            <Grid container spacing={3}>
                {/* Left: Editor */}
                <Grid item xs={12} lg={7}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Toolbar */}
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                <FormControl size="small" sx={{ minWidth: 130 }}>
                                    <InputLabel>Language</InputLabel>
                                    <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)}>
                                        {LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}
                                    onClick={() => setCode(SAMPLE_CODE[language] || '')}>
                                    Load Sample
                                </Button>
                                <Box sx={{ flexGrow: 1 }} />
                                <Chip label={`${code.split('\n').length} lines`} size="small" variant="outlined" />
                            </Box>

                            {/* Code textarea */}
                            <Box
                                component="textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={`# Paste your ${language} code here...\n# Or click "Load Sample" to try an example`}
                                rows={18}
                                sx={{
                                    width: '100%', p: 2, fontFamily: 'monospace', fontSize: 13,
                                    bgcolor: '#1e1e1e', color: '#d4d4d4', border: 'none',
                                    borderRadius: 2, resize: 'vertical', outline: 'none',
                                    lineHeight: 1.6, boxSizing: 'border-box',
                                }}
                            />

                            <TextField fullWidth label="Problem description (optional)" size="small" multiline rows={2}
                                value={problem} onChange={(e) => setProblem(e.target.value)}
                                sx={{ mt: 2, mb: 2 }} />

                            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                            <Button variant="contained" fullWidth size="large" startIcon={<SendIcon />}
                                onClick={handleSubmit} disabled={submitting || polling}
                                sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}>
                                {submitting ? <CircularProgress size={22} color="inherit" />
                                    : polling ? 'Analysing… please wait ⏳'
                                        : 'Analyze with AI →'}
                            </Button>

                            {/* Status indicator */}
                            {status && (
                                <Alert
                                    icon={status === 'completed' ? <CheckCircle /> : status === 'failed' ? <ErrorIcon /> : <HourglassEmpty />}
                                    severity={status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'info'}
                                    sx={{ mt: 2, borderRadius: 2 }}>
                                    {status === 'processing' ? 'AI is analyzing your code. Results will appear shortly…' :
                                        status === 'completed' ? 'Analysis complete! See feedback on the right.' :
                                            'Analysis failed. Please try again.'}
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Feedback + History */}
                <Grid item xs={12} lg={5}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Feedback Panel */}
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>🤖 AI Feedback</Typography>
                                {polling && (
                                    <Box sx={{ py: 2 }}>
                                        <LinearProgress sx={{ borderRadius: 5, mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary" textAlign="center">
                                            Analyzing your code with RAG pipeline…
                                        </Typography>
                                    </Box>
                                )}
                                {feedback ? (
                                    <Box>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Chip label={`Confidence: ${Math.round((feedback.confidence_score || 0) * 100)}%`}
                                                color="primary" size="small" />
                                            {feedback.is_recurring && <Chip label="⚠️ Recurring Pattern" color="warning" size="small" />}
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {feedback.overall_feedback}
                                        </Typography>

                                        {(feedback.errors || []).length > 0 && (
                                            <>
                                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>Issues Found</Typography>
                                                {feedback.errors.map((err, i) => (
                                                    <Accordion key={i} disableGutters sx={{ mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                <Chip label={err.type || err.concept || 'issue'} size="small"
                                                                    sx={{ bgcolor: '#ffebee', color: '#c62828' }} />
                                                                <Typography variant="body2">{err.message || err.description || 'Error detected'}</Typography>
                                                            </Box>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            {err.suggestion && <Typography variant="body2" color="text.secondary">{err.suggestion}</Typography>}
                                                            {err.line && <Chip label={`Line ${err.line}`} size="small" variant="outlined" sx={{ mt: 1 }} />}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ))}
                                            </>
                                        )}

                                        {(feedback.concepts_to_study || []).length > 0 && (
                                            <>
                                                <Divider sx={{ my: 2 }} />
                                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>📚 Study These</Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {feedback.concepts_to_study.map((c) => (
                                                        <Chip key={c} label={c} size="small" sx={{ bgcolor: '#e3f2fd' }} />
                                                    ))}
                                                </Box>
                                            </>
                                        )}

                                        {feedback.encouraging_message && (
                                            <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                                                {feedback.encouraging_message}
                                            </Alert>
                                        )}
                                    </Box>
                                ) : !polling ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                                        Submit your code above to receive detailed AI feedback 🚀
                                    </Typography>
                                ) : null}
                            </CardContent>
                        </Card>

                        {/* History */}
                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>📚 Recent Submissions</Typography>
                                {history.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">No submissions yet.</Typography>
                                ) : (
                                    <List dense disablePadding>
                                        {history.slice(0, 5).map((sub) => (
                                            <ListItemButton key={sub.job_id} sx={{ borderRadius: 2, mb: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <CodeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography variant="body2" fontWeight={600}>{sub.language}</Typography>}
                                                    secondary={<Typography variant="caption" color="text.secondary">
                                                        {new Date(sub.created_at).toLocaleDateString()}
                                                    </Typography>}
                                                />
                                                <Chip
                                                    label={sub.status === 'completed' ? `${Math.round((sub.confidence_score || 0) * 100)}%` : sub.status}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: sub.status === 'completed' ? '#e8f5e9' : '#fff3e0',
                                                        color: sub.status === 'completed' ? '#2e7d32' : '#e65100',
                                                        fontWeight: 700, fontSize: '0.7rem',
                                                    }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </PageContainer>
    );
}
