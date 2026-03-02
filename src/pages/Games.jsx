import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Grid, Card, CardContent, Chip, Button,
    Skeleton, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    RadioGroup, FormControlLabel, Radio, LinearProgress,
} from '@mui/material';
import { SportsEsports, Star, CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const GAME_CARDS = [
    { id: 'debug_the_bug', title: 'Debug the Bug', icon: '🐛', desc: 'Find and fix the hidden bug in the code snippet.', color: '#e53935', diff: 'Medium' },
    { id: 'predict_output', title: 'Predict Output', icon: '🎯', desc: 'Predict what the code prints without running it.', color: '#1976d2', diff: 'Medium' },
    { id: 'code_jumble', title: 'Code Jumble', icon: '🧩', desc: 'Rearrange jumbled lines into working code.', color: '#7b1fa2', diff: 'Easy' },
    { id: 'syntax_sprint', title: 'Syntax Sprint', icon: '⚡', desc: 'Spot the syntax error and fix it fast.', color: '#f57c00', diff: 'Easy' },
    { id: 'trivia', title: 'Code Trivia', icon: '🎓', desc: 'Test your CS theory knowledge with fun questions.', color: '#388e3c', diff: 'Easy' },
];

export default function Games() {
    console.log('Rendering Games page');
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [question, setQuestion] = useState(null);
    const [gameType, setGameType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState('');
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [open, setOpen] = useState(false);

    if (!user) {
        return (
            <PageContainer>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            </PageContainer>
        );
    }

    const startGame = async (type) => {
        setGameType(type);
        setLoading(true);
        setError('');
        setQuestion(null);
        setSelected('');
        setAnswered(false);
        setOpen(true);
        try {
            const { data } = await axios.get(
                `${API_BASE}/api/game/question/${type}?user_id=${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuestion(data.question);
        } catch (err) {
            console.error('Game fetch error:', err);
            setError('Could not load question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!selected) return;
        setAnswered(true);
        if (selected === question?.correct_answer) {
            setScore((s) => s + (question?.points || 100));
        }
    };

    const handleClose = () => { setOpen(false); setQuestion(null); setSelected(''); setAnswered(false); };

    return (
        <PageContainer>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>🎮 Coding Games</Typography>
                    <Typography variant="body2" color="text.secondary">Sharpen your skills while having fun</Typography>
                </Box>
                <Chip
                    icon={<Star sx={{ color: '#f57c00 !important' }} />}
                    label={`Score: ${score} pts`}
                    sx={{ fontWeight: 700, bgcolor: '#fff8e1', color: '#e65100', fontSize: 16 }}
                />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            {/* Game Cards */}
            <Grid container spacing={3}>
                {GAME_CARDS.map((game) => (
                    <Grid item xs={12} sm={6} md={4} key={game.id}>
                        <Card
                            onClick={() => startGame(game.id)}
                            sx={{
                                borderRadius: 3, cursor: 'pointer', height: '100%',
                                transition: 'all .2s', border: `2px solid transparent`,
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 12px 32px ${game.color}30`,
                                    border: `2px solid ${game.color}40`,
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography fontSize={40} sx={{ mb: 1 }}>{game.icon}</Typography>
                                <Typography variant="h6" fontWeight={700} gutterBottom>{game.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{game.desc}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip label={game.diff} size="small"
                                        sx={{ bgcolor: `${game.color}18`, color: game.color, fontWeight: 600 }} />
                                    <Chip label="Play now →" size="small" variant="outlined" sx={{ color: game.color }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Daily Challenge Banner */}
            <Box sx={{ textAlign: 'center', mt: 6, p: 4, bgcolor: '#e3f2fd', borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>🏆 Submit Your Code</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get AI-powered feedback and improve your Error DNA!
                </Typography>
                <Button variant="contained" startIcon={<SportsEsports />} onClick={() => navigate('/submit')}>
                    Submit Code for Review
                </Button>
            </Box>

            {/* Question Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {GAME_CARDS.find(g => g.id === gameType)?.icon}{' '}
                    {GAME_CARDS.find(g => g.id === gameType)?.title}
                </DialogTitle>
                <DialogContent dividers>
                    {loading ? (
                        <Box sx={{ py: 2 }}>
                            <LinearProgress sx={{ mb: 2, borderRadius: 5 }} />
                            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                        </Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : question ? (
                        <Box>
                            <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>{question.question}</Typography>
                            {question.code_snippet && (
                                <Box sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 2, borderRadius: 2, mb: 2, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                                    {question.code_snippet}
                                </Box>
                            )}
                            <RadioGroup value={selected} onChange={(e) => !answered && setSelected(e.target.value)}>
                                {(question.options || []).map((opt, i) => (
                                    <FormControlLabel
                                        key={i} value={opt.charAt(0)} control={<Radio />} label={opt}
                                        sx={{
                                            mb: 1, px: 1.5, py: 0.5, borderRadius: 2, border: '1px solid',
                                            borderColor: answered
                                                ? opt.charAt(0) === question.correct_answer ? '#4caf50'
                                                    : opt.charAt(0) === selected ? '#f44336' : 'divider'
                                                : 'divider',
                                            bgcolor: answered
                                                ? opt.charAt(0) === question.correct_answer ? '#e8f5e9'
                                                    : opt.charAt(0) === selected ? '#ffebee' : 'transparent'
                                                : 'transparent',
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                            {answered && (
                                <Alert
                                    severity={selected === question.correct_answer ? 'success' : 'error'}
                                    icon={selected === question.correct_answer ? <CheckCircle /> : <Cancel />}
                                    sx={{ mt: 2, borderRadius: 2 }}
                                >
                                    <Typography fontWeight={700}>
                                        {selected === question.correct_answer ? `Correct! +${question.points || 100} pts 🎉` : 'Not quite!'}
                                    </Typography>
                                    <Typography variant="body2">{question.explanation}</Typography>
                                </Alert>
                            )}
                        </Box>
                    ) : null}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>Close</Button>
                    {!answered && question && (
                        <Button onClick={handleSubmit} variant="contained" disabled={!selected} sx={{ borderRadius: 2 }}>
                            Submit Answer
                        </Button>
                    )}
                    {answered && (
                        <Button onClick={() => startGame(gameType)} variant="contained" sx={{ borderRadius: 2 }}>
                            Next Question 🔄
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
}
