import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, Card, CardContent, LinearProgress, Chip,
    Skeleton, Alert, Button, Grid, Divider, Collapse, IconButton,
    Tooltip,
} from '@mui/material';
import {
    Refresh, CheckCircle, RadioButtonUnchecked, Lock,
    ExpandMore, ExpandLess, TrendingUp, ArrowForward,
    PlayCircleOutline, AccessTime,
} from '@mui/icons-material';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

console.log('Rendering Roadmap page');

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const GRAD = 'linear-gradient(90deg, #10b981, #3b82f6)';
const HEAD = '#0f172a';
const BODY = '#475569';
const BORDER = '#e2e8f0';
const BG = '#f8fafc';

// ── Topic status config ──────────────────────────────────────
const TOPIC_STATUS = [
    { key: 'not_started', label: 'Not Started', icon: '○', color: '#94a3b8' },
    { key: 'in_progress', label: 'In Progress', icon: '⏳', color: '#f59e0b' },
    { key: 'completed', label: 'Completed', icon: '✅', color: '#10b981' },
];

// Generate a minimal practice snippet based on topic name keywords
function generateSampleCode(topicName) {
    const t = (topicName || '').toLowerCase();
    if (t.includes('loop') || t.includes('iteration'))
        return `# Practice: ${topicName}\n# Fix the loop below\ndef sum_list(nums):\n    total = 0\n    for i in range(len(nums) + 1):  # Bug here\n        total += nums[i]\n    return total\n\nprint(sum_list([1, 2, 3]))`;
    if (t.includes('recursion') || t.includes('recursive'))
        return `# Practice: ${topicName}\n# Fix the base case\ndef factorial(n):\n    if n == 0:  # Is this the right base case?\n        return 0\n    return n * factorial(n - 1)\n\nprint(factorial(5))`;
    if (t.includes('string'))
        return `# Practice: ${topicName}\ndef reverse_string(s):\n    result = ''\n    for i in range(len(s)):  # Off-by-one?\n        result = s[i] + result\n    return result\n\nprint(reverse_string("hello"))`;
    if (t.includes('sort') || t.includes('algorithm'))
        return `# Practice: ${topicName}\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i):  # Bug: boundary\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12]))`;
    // Generic fallback
    return `# Practice: ${topicName}\n# Write your solution here\n\ndef solution():\n    pass\n\nprint(solution())`;
}

// ── Placement Readiness Hero Card ────────────────────────────
function ReadinessCard({ totalWeeks, currentWeekIdx }) {
    // readiness = (currentWeekIndex + 1) / totalWeeks * 100
    const progressPercent = totalWeeks > 0 ? Math.round(((currentWeekIdx + 1) / totalWeeks) * 100) : 0;
    const weeksLeft = Math.max(totalWeeks - (currentWeekIdx + 1), 0);

    return (
        <Card sx={{
            borderRadius: '16px',
            bgcolor: '#fff',
            border: `1px solid ${BORDER}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            mb: 4, position: 'relative', overflow: 'hidden',
        }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Typography fontSize={28}>🎯</Typography>
                            <Box>
                                <Typography sx={{ fontWeight: 700, color: BODY, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Placement Readiness
                                </Typography>
                                {progressPercent > 0 ? (
                                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '2.4rem', md: '2.8rem' }, color: HEAD, lineHeight: 1 }}>
                                        {progressPercent}
                                        <Box component="span" sx={{ fontSize: '1.4rem', color: '#10b981', ml: 0.5 }}>%</Box>
                                    </Typography>
                                ) : (
                                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: BODY, mt: 0.5 }}>
                                        Complete Week 1 to unlock score
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Typography sx={{ color: BODY, fontSize: 13.5, mt: 1 }}>
                            {progressPercent > 0 ? (
                                <>
                                    At current pace: <Box component="span" sx={{ fontWeight: 700, color: '#10b981' }}>
                                        {weeksLeft > 0 ? `Ready in ~${weeksLeft} week${weeksLeft === 1 ? '' : 's'}` : '🎉 You are placement ready!'}
                                    </Box>
                                </>
                            ) : (
                                'Complete your first practice to see your score.'
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: BODY }}>Learning Progress</Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                                    Week {currentWeekIdx + 1} of {totalWeeks}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progressPercent}
                                sx={{
                                    height: 10, borderRadius: 5,
                                    bgcolor: '#f1f5f9',
                                    '& .MuiLinearProgress-bar': { background: GRAD, borderRadius: 5 },
                                }}
                            />
                        </Box>
                        {progressPercent > 0 && (
                            <Typography sx={{ fontSize: 12, color: BODY, fontStyle: 'italic' }}>
                                Score calculated from current progress & accuracy.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

// ── Error DNA callout ────────────────────────────────────────
function ErrorDNACallout({ patterns }) {
    if (!patterns?.length) return null;
    const top = patterns[0];
    return (
        <Box sx={{
            display: 'flex', gap: 1.5, alignItems: 'flex-start',
            bgcolor: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '12px', p: 2, mb: 3,
        }}>
            <Box>
                <Typography sx={{ fontWeight: 700, color: '#92400e', fontSize: 13, mb: 0.3 }}>
                    ⚠️ Based on your Error DNA:
                </Typography>
                <Typography sx={{ color: '#78350f', fontSize: 13 }}>
                    "{top.concept?.replace(/_/g, ' ')} errors appear in{' '}
                    <Box component="span" sx={{ fontWeight: 700 }}>{top.percent ?? Math.round((top.frequency || 0) * 10)}%</Box>
                    {' '}of your submissions — this week targets that exact weakness."
                </Typography>
            </Box>
        </Box>
    );
}

// ── Single topic card ────────────────────────────────────────
function TopicCard({ topic }) {
    const navigate = useNavigate();
    const [status, setStatus] = useState(topic.status || 'not_started');
    const s = TOPIC_STATUS.find(x => x.key === status) || TOPIC_STATUS[0];

    const handleStart = () => {
        navigate('/submit', {
            state: {
                topicName: topic.name,
                hint: topic.why || '',
                sampleCode: generateSampleCode(topic.name),
            },
        });
    };

    return (
        <Card sx={{
            borderRadius: '14px', border: `1px solid ${BORDER}`,
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            mb: 1.5,
            transition: 'all .2s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(16,185,129,0.12)',
                borderColor: '#a7f3d0',
            },
        }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                            <Typography fontSize={16}>📌</Typography>
                            <Typography sx={{ fontWeight: 700, color: HEAD, fontSize: '0.95rem' }}>
                                {topic.name}
                            </Typography>
                        </Box>
                        {topic.why && (
                            <Typography sx={{ color: BODY, fontSize: 13, lineHeight: 1.6, mb: 1.2 }}>
                                {topic.why}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            {topic.estimated_time && (
                                <Chip
                                    icon={<AccessTime sx={{ fontSize: '12px !important' }} />}
                                    label={topic.estimated_time}
                                    size="small"
                                    sx={{ bgcolor: '#f1f5f9', color: BODY, fontSize: 11, height: 22 }}
                                />
                            )}
                            {(topic.resources || []).slice(0, 2).map(r => (
                                <Chip key={r} label={r} size="small" sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontSize: 11, height: 22 }} />
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5, minWidth: 110 }}>
                        {/* Status selector */}
                        <Box
                            onClick={() => {
                                const idx = TOPIC_STATUS.findIndex(x => x.key === status);
                                setStatus(TOPIC_STATUS[(idx + 1) % TOPIC_STATUS.length].key);
                            }}
                            sx={{
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.6,
                                bgcolor: '#f8fafc', border: `1px solid ${BORDER}`,
                                borderRadius: '8px', px: 1.2, py: 0.5, fontSize: 12, fontWeight: 600,
                                color: s.color, transition: 'all .15s',
                                '&:hover': { borderColor: '#10b981' },
                            }}
                        >
                            <span style={{ fontSize: 14 }}>{s.icon}</span> {s.label}
                        </Box>
                        <Button
                            size="small"
                            onClick={handleStart}
                            endIcon={<ArrowForward sx={{ fontSize: '14px !important' }} />}
                            sx={{
                                background: GRAD, color: '#fff', fontWeight: 700,
                                textTransform: 'none', borderRadius: '8px', fontSize: 12,
                                px: 1.8, py: 0.6, minWidth: 80,
                                '&:hover': { opacity: 0.9 },
                            }}
                        >
                            Start
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

// ── Week row ─────────────────────────────────────────────────
function WeekRow({ week, index, active, completed, locked, patterns }) {
    const [open, setOpen] = useState(active);
    const weekNum = index + 1;

    let borderColor = BORDER;
    let bgColor = '#fff';
    let leftAccent = 'transparent';
    if (active) { borderColor = '#a7f3d0'; bgColor = '#f0fdf4'; leftAccent = '#10b981'; }
    if (completed) { borderColor = '#bbf7d0'; bgColor = '#f9fffe'; leftAccent = '#34d399'; }
    if (locked) { bgColor = '#fdfdfd'; }

    return (
        <Card sx={{
            borderRadius: '16px',
            border: `1px solid ${borderColor}`,
            borderLeft: `4px solid ${leftAccent}`,
            bgcolor: bgColor,
            mb: 2.5,
            opacity: locked ? 0.45 : 1,
            pointerEvents: locked ? 'none' : 'auto',
            boxShadow: active ? '0 6px 24px rgba(16,185,129,0.12)' : '0 1px 6px rgba(0,0,0,0.04)',
            transition: 'all .2s ease',
        }}>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                {/* Week header — always visible */}
                <Box
                    onClick={() => !locked && setOpen(o => !o)}
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 2,
                        px: 3, py: 2.5, cursor: locked ? 'default' : 'pointer',
                        '&:hover': locked ? {} : { bgcolor: 'rgba(0,0,0,0.01)' },
                        borderRadius: '16px 16px 0 0',
                    }}
                >
                    {/* Icon */}
                    <Box sx={{ fontSize: 22 }}>
                        {locked ? '🔒' :
                            completed ? <CheckCircle sx={{ color: '#10b981', fontSize: 24 }} /> :
                                active ? <PlayCircleOutline sx={{ color: '#10b981', fontSize: 24 }} /> :
                                    <RadioButtonUnchecked sx={{ color: '#94a3b8', fontSize: 24 }} />}
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 700, color: locked ? '#94a3b8' : HEAD, fontSize: '1rem' }}>
                                Week {weekNum}: {week.focus}
                            </Typography>
                            {active && (
                                <Chip
                                    label="Current Week"
                                    size="small"
                                    sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 700, fontSize: 11, height: 22 }}
                                />
                            )}
                            {completed && (
                                <Chip
                                    label="Completed ✓"
                                    size="small"
                                    sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 700, fontSize: 11, height: 22 }}
                                />
                            )}
                            {locked && (
                                <Chip
                                    label="Locked"
                                    size="small"
                                    icon={<Lock sx={{ fontSize: '12px !important' }} />}
                                    sx={{ bgcolor: '#f1f5f9', color: '#94a3b8', fontWeight: 600, fontSize: 11, height: 22 }}
                                />
                            )}
                        </Box>
                        {week.practice_goal && !locked && (
                            <Typography sx={{ fontSize: 13, color: BODY, mt: 0.3 }}>
                                🎯 {week.practice_goal}
                            </Typography>
                        )}
                        {/* Locked week: show 2-3 topic name previews */}
                        {locked && (week.topics || []).slice(0, 3).length > 0 && (
                            <Typography sx={{ fontSize: 12, color: '#94a3b8', mt: 0.4 }}>
                                {(week.topics || []).slice(0, 3).map(t => t.name).join(' · ')}
                                {(week.topics || []).length > 3 ? ' · …' : ''}
                            </Typography>
                        )}
                    </Box>

                    {!locked && (
                        <IconButton size="small" sx={{ color: '#94a3b8' }}>
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    )}
                </Box>

                {/* Expandable body */}
                <Collapse in={open && !locked}>
                    <Divider sx={{ borderColor: borderColor }} />
                    <Box sx={{ px: 3, py: 2.5 }}>
                        {/* Error DNA callout only for active week */}
                        {active && <ErrorDNACallout patterns={patterns} />}

                        {/* Topics */}
                        {(week.topics || []).length === 0 ? (
                            <Typography sx={{ color: BODY, fontSize: 14 }}>No topics listed for this week.</Typography>
                        ) : (
                            (week.topics || []).map((topic, ti) => (
                                <TopicCard key={ti} topic={topic} locked={false} />
                            ))
                        )}
                    </Box>
                </Collapse>
            </CardContent>
        </Card>
    );
}

// ── Main page ────────────────────────────────────────────────
export default function Roadmap() {
    console.log('Rendering Roadmap page');
    const { user, token } = useAuth();
    const [roadmap, setRoadmap] = useState(null);
    const [patterns, setPatterns] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeStep, setActiveStep] = useState(0);  // 0-based

    const fetchAll = async (force = false) => {
        if (!user?.id) return;
        setLoading(true);
        setError('');
        try {
            const [rmRes, ptRes, stRes] = await Promise.allSettled([
                axios.get(`${API_BASE}/api/roadmap/${user.id}${force ? '?regenerate=true' : ''}`,
                    { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE}/api/analytics/error-patterns/${user.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE}/api/analytics/dashboard/${user.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (rmRes.status === 'fulfilled') { setRoadmap(rmRes.value.data.roadmap); }
            else setError('Could not load roadmap. Click Regenerate to create one.');

            if (ptRes.status === 'fulfilled') { setPatterns(ptRes.value.data.breakdown || []); }
            if (stRes.status === 'fulfilled') { setStats(stRes.value.data); }
        } catch (err) {
            console.error('Roadmap fetch error:', err);
            setError('Could not load roadmap. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [user]);

    if (!user) {
        return (
            <PageContainer maxWidth="md">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={90} sx={{ borderRadius: 3, mb: 2 }} />
                ))}
            </PageContainer>
        );
    }

    const weeks = roadmap?.weeks || [];
    const totalWeeks = weeks.length;
    // Find active index from data, fallback to saved state
    const currentWeekIdx = Math.min(activeStep, Math.max(totalWeeks - 1, 0));

    return (
        <PageContainer maxWidth="md">
            {/* ── Page header ─── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: HEAD }}>
                        🗺️ Your Learning Roadmap
                    </Typography>
                    <Typography sx={{ color: BODY, fontSize: 14, mt: 0.4 }}>
                        AI-generated based on your Error DNA &amp; placement goals
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    size="small"
                    onClick={() => fetchAll(true)}
                    disabled={loading}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, borderColor: BORDER }}
                >
                    Regenerate
                </Button>
            </Box>

            {/* ── Error banner ─── */}
            {error && (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}
                    action={<Button size="small" color="inherit" onClick={() => fetchAll(true)}>Regenerate</Button>}>
                    {error}
                </Alert>
            )}

            {/* ── Placement readiness card ─── */}
            {loading ? (
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3, mb: 4 }} />
            ) : (
                <ReadinessCard
                    totalWeeks={totalWeeks}
                    currentWeekIdx={currentWeekIdx}
                />
            )}

            {/* ── Summary pills ─── */}
            {!loading && totalWeeks > 0 && (
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3.5, flexWrap: 'wrap' }}>
                    <Chip label={`${totalWeeks} Weeks Total`} sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 700 }} />
                    <Chip label={`${roadmap?.total_topics ?? (weeks.reduce((a, w) => a + (w.topics?.length || 0), 0))} Topics`}
                        sx={{ bgcolor: '#f0fdf4', color: '#065f46', fontWeight: 700 }} />
                    {patterns[0] && (
                        <Chip
                            icon={<TrendingUp sx={{ color: '#d97706 !important', fontSize: '16px !important' }} />}
                            label={`Top issue: ${patterns[0].concept?.replace(/_/g, ' ')}`}
                            sx={{ bgcolor: '#fffbeb', color: '#92400e', fontWeight: 600, border: '1px solid #fde68a' }}
                        />
                    )}
                </Box>
            )}

            {/* ── Week rows ─── */}
            {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 2, mb: 2 }} />
                ))
            ) : totalWeeks === 0 ? (
                <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center', bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <Typography fontSize={40} mb={1}>🌱</Typography>
                    <Typography fontWeight={700} color={HEAD} mb={1}>No roadmap yet</Typography>
                    <Typography color={BODY} fontSize={14} mb={2}>
                        Submit some code first — the AI will generate a personalized roadmap based on your mistakes.
                    </Typography>
                    <Button
                        onClick={() => fetchAll(true)}
                        sx={{ background: GRAD, color: '#fff', borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3 }}
                        startIcon={<Refresh />}
                    >
                        Generate Now
                    </Button>
                </Card>
            ) : (
                weeks.map((week, idx) => {
                    const completed = idx < currentWeekIdx;
                    const active = idx === currentWeekIdx;
                    const locked = idx > currentWeekIdx;
                    return (
                        <WeekRow
                            key={idx}
                            week={week}
                            index={idx}
                            active={active}
                            completed={completed}
                            locked={locked}
                            patterns={patterns}
                        />
                    );
                })
            )}

            {/* ── Week navigation (below list) ─── */}
            {!loading && totalWeeks > 1 && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="outlined"
                        disabled={currentWeekIdx === 0}
                        onClick={() => setActiveStep(s => Math.max(0, s - 1))}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, borderColor: BORDER }}
                    >
                        ← Previous Week
                    </Button>
                    <Button
                        disabled={currentWeekIdx >= totalWeeks - 1}
                        onClick={() => setActiveStep(s => Math.min(totalWeeks - 1, s + 1))}
                        sx={{
                            background: GRAD, color: '#fff',
                            borderRadius: '10px', textTransform: 'none', fontWeight: 700,
                            '&:hover': { opacity: 0.9 },
                            '&.Mui-disabled': { background: BORDER, color: '#94a3b8' },
                        }}
                    >
                        Complete &amp; Next Week →
                    </Button>
                </Box>
            )}
        </PageContainer>
    );
}
