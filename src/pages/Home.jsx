import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Grid, Card, CardContent,
    Avatar, Chip, Container, Divider,
} from '@mui/material';
import {
    ArrowForward, PlayArrow, Code, CheckCircle,
    TrendingUp, SportsEsports, Map, Psychology,
    EmojiEvents, AutoAwesome,
} from '@mui/icons-material';

// ─── Design tokens ──────────────────────────────────────────
const GRAD = 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)';
const HEAD = '#0f172a';
const BODY = '#475569';
const BORD = '#e2e8f0';

// ─── CSS keyframe injection ──────────────────────────────────
const STYLE = `
  @keyframes fadeSlideUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn        { from { opacity:0; } to { opacity:1; } }
  @keyframes float         { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
  @keyframes fadeCardIn    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
`;

// ─── Shared button components ────────────────────────────────
function PrimaryBtn({ children, onClick }) {
    return (
        <Button onClick={onClick} sx={{
            background: GRAD, color: '#fff', fontWeight: 700,
            px: 3.5, py: 1.4, borderRadius: '12px', textTransform: 'none', fontSize: '1rem',
            boxShadow: '0 6px 20px rgba(16,185,129,0.22)',
            '&:hover': { opacity: 0.9, transform: 'translateY(-1px)', transition: 'all .15s' },
            animation: 'fadeIn 0.6s ease 0.5s both',
        }}>
            {children}
        </Button>
    );
}

function SecondaryBtn({ children, onClick }) {
    return (
        <Button onClick={onClick} sx={{
            bgcolor: '#fff', color: HEAD, fontWeight: 600,
            px: 3, py: 1.4, borderRadius: '12px', textTransform: 'none', fontSize: '1rem',
            border: `1px solid ${BORD}`,
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
            animation: 'fadeIn 0.6s ease 0.65s both',
        }}>
            {children}
        </Button>
    );
}

// ─── Mock Code Editor ────────────────────────────────────────
function CodeDemo() {
    const lines = [
        { n: 1, code: 'def find_max(nums):', c: '#7dd3fc' },
        { n: 2, code: '    max_val = 0', c: '#e2e8f0' },
        { n: 3, code: '    for i in range(len(nums)+1):', c: '#fbbf24' },
        { n: 4, code: '        if nums[i] > max_val:', c: '#e2e8f0' },
        { n: 5, code: '            max_val = nums[i]', c: '#6ee7b7' },
        { n: 6, code: '    return max_val', c: '#e2e8f0' },
    ];

    return (
        <Box sx={{ position: 'relative', animation: 'float 4s ease-in-out infinite' }}>
            {/* Editor card */}
            <Box sx={{
                bgcolor: '#0f172a', borderRadius: '18px', p: '20px 24px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
                fontFamily: '"Fira Code","Courier New",monospace', fontSize: 13,
            }}>
                {/* Traffic lights */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {['#ff5f57', '#ffbd2e', '#28c840'].map(c => (
                        <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
                    ))}
                    <Typography sx={{ ml: 1, fontSize: 11, color: '#64748b' }}>solution.py</Typography>
                </Box>

                {lines.map(({ n, code, c }) => (
                    <Box key={n} sx={{ display: 'flex', gap: 2, mb: 0.7, position: 'relative' }}>
                        {/* bug highlight on line 3 */}
                        {n === 3 && (
                            <Box sx={{
                                position: 'absolute', left: -4, right: -4, top: -2, height: 24,
                                bgcolor: 'rgba(239,68,68,0.15)', borderRadius: 1,
                                border: '1px solid rgba(239,68,68,0.3)',
                            }} />
                        )}
                        <Typography sx={{ color: '#334155', fontSize: 12, minWidth: 18, zIndex: 1 }}>{n}</Typography>
                        <Typography sx={{ color: c, fontSize: 12, letterSpacing: 0.2, zIndex: 1 }}>{code}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Floating feedback pill */}
            <Box sx={{
                position: 'absolute', bottom: -32, right: -20,
                bgcolor: '#fff', borderRadius: '16px',
                p: '12px 16px',
                boxShadow: '0 12px 40px rgba(16,185,129,0.15)',
                border: `1px solid ${BORD}`,
                zIndex: 2, minWidth: 210,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                    <Box sx={{ width: 26, height: 26, borderRadius: '8px', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AutoAwesome sx={{ color: '#fff', fontSize: 13 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: HEAD }}>AI Feedback</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: BODY, lineHeight: 1.5 }}>
                    🐛 Off-by-one in <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>range()</code> — remove <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>+1</code>
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.8, mt: 1.2, flexWrap: 'wrap' }}>
                    <Chip label="Confidence 92%" size="small" sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 700, fontSize: 11 }} />
                    <Chip label="Loop Bug" size="small" sx={{ bgcolor: '#fef9c3', color: '#78350f', fontWeight: 600, fontSize: 11 }} />
                </Box>
            </Box>
        </Box>
    );
}

// ─── Static data ────────────────────────────────────────────
const FEATURES = [
    { icon: <Psychology />, title: 'RAG-Powered Analysis', desc: 'Retrieves the most relevant context from your codebase and explains every bug in plain English.' },
    { icon: <TrendingUp />, title: 'Error DNA Tracking', desc: 'Detects recurring mistake patterns and surfaces them so you can break bad habits permanently.' },
    { icon: <Map />, title: 'Personalized Roadmap', desc: 'Auto-generated week-by-week study plan tuned to your weakest concepts and placement goals.' },
    { icon: <SportsEsports />, title: 'Coding Games', desc: 'Gamified challenges targeting your exact weak spots — debug, predict output, code jumble.' },
    { icon: <EmojiEvents />, title: 'Leaderboard', desc: 'Weekly rankings among peers keep the competitive edge alive and motivation high.' },
    { icon: <CheckCircle />, title: 'Placement Readiness', desc: 'Track your readiness score with a clear data-driven path to your first developer offer.' },
];

const STEPS = [
    { emoji: '💻', n: '01', title: 'Submit Your Code', desc: 'Paste any Python, JS, or Java snippet — buggy or clean.' },
    { emoji: '🤖', n: '02', title: 'AI Analyzes It', desc: 'RAG pipeline retrieves context, LLM identifies every bug with clear explanations.' },
    { emoji: '🧬', n: '03', title: 'Error DNA Updated', desc: 'Recurring patterns tracked. Your roadmap adapts to your real weaknesses.' },
    { emoji: '🏆', n: '04', title: 'Level Up & Get Hired', desc: 'Games, streaks, and a placement-readiness score keep you improving every day.' },
];

const TESTIMONIALS = [
    { name: 'Priya Sharma', college: 'IIT Delhi', text: '"CodeMentor AI caught the same off-by-one I had been making for months. The Error DNA feature is genuinely outstanding."', init: 'P', color: '#10b981' },
    { name: 'Rahul Gupta', college: 'NIT Trichy', text: '"The roadmap told me to focus on recursion when I had no idea that was my weak spot. Landed my first offer in 6 weeks."', init: 'R', color: '#3b82f6' },
    { name: 'Anjali Singh', college: 'VIT Vellore', text: '"The games are genuinely fun. I play Predict Output every morning and I can feel my pattern recognition improving."', init: 'A', color: '#0ea5e9' },
];

// ─── Main component ─────────────────────────────────────────
export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <style>{STYLE}</style>
            <Box>

                {/* ════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════ */}
                <Box id="hero" sx={{ bgcolor: '#fff', borderBottom: `1px solid ${BORD}` }}>
                    <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
                        <Grid container spacing={{ xs: 8, md: 10 }} alignItems="center">

                            {/* Left */}
                            <Grid item xs={12} md={6}>
                                <Chip
                                    label="🚀 AWS AI Hackathon 2026"
                                    sx={{
                                        bgcolor: '#d1fae5', color: '#065f46', fontWeight: 700, mb: 3, fontSize: 13,
                                        border: '1px solid #a7f3d0',
                                        animation: 'fadeIn 0.5s ease 0.1s both',
                                    }}
                                />

                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontWeight: 800, color: HEAD,
                                        fontSize: { xs: '2.2rem', md: '3.1rem' },
                                        lineHeight: 1.18, mb: 3,
                                        animation: 'fadeSlideUp 0.6s ease 0.15s both',
                                    }}
                                >
                                    Your AI Code Mentor That{' '}
                                    <Box component="span" sx={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Grows With You
                                    </Box>
                                </Typography>

                                <Typography sx={{
                                    color: BODY, fontSize: '1.1rem', lineHeight: 1.75, mb: 4, maxWidth: 480,
                                    animation: 'fadeSlideUp 0.6s ease 0.3s both',
                                }}>
                                    Submit code → get instant RAG-powered feedback → track your Error DNA → follow a personalized roadmap.
                                    Built for CS students targeting placement.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                                    <PrimaryBtn onClick={() => navigate('/register')}>
                                        Get Started Free <ArrowForward sx={{ ml: 0.5, fontSize: 18 }} />
                                    </PrimaryBtn>
                                    <SecondaryBtn onClick={() => navigate('/submit')}>
                                        <PlayArrow sx={{ mr: 0.5, fontSize: 18, color: '#10b981' }} /> Try Demo
                                    </SecondaryBtn>
                                </Box>

                                {/* Trust row */}
                                <Box sx={{ display: 'flex', gap: 4, animation: 'fadeIn 0.6s ease 0.8s both', flexWrap: 'wrap' }}>
                                    {[['10K+', 'Code Reviews'], ['94%', 'Bug Detection Accuracy'], ['3×', 'Faster Growth']].map(([v, l]) => (
                                        <Box key={l}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: HEAD }}>{v}</Typography>
                                            <Typography sx={{ fontSize: 13, color: BODY }}>{l}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Right – code demo */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ pl: { md: 4 }, pb: 6 }}>
                                    <CodeDemo />
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* ════════════════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════════════════ */}
                <Box id="features" sx={{ bgcolor: '#f8fafc', borderBottom: `1px solid ${BORD}` }}>
                    <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: HEAD, mb: 2 }}>
                                Everything in One Platform
                            </Typography>
                            <Typography sx={{ color: BODY, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
                                From raw code submission to placement-ready developer — all the tools you need, none you don't.
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {FEATURES.map(({ icon, title, desc }, i) => (
                                <Grid item xs={12} sm={6} md={4} key={title}>
                                    <Card sx={{
                                        bgcolor: '#fff', borderRadius: '16px',
                                        border: `1px solid ${BORD}`,
                                        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                                        height: '100%',
                                        animation: `fadeCardIn 0.5s ease ${0.1 + i * 0.08}s both`,
                                        transition: 'all .2s ease',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(16,185,129,0.12)', borderColor: '#a7f3d0' },
                                    }}>
                                        <CardContent sx={{ p: 3.5 }}>
                                            <Box sx={{
                                                width: 46, height: 46, borderRadius: '12px',
                                                background: GRAD,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                mb: 2.5, boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                                            }}>
                                                {React.cloneElement(icon, { sx: { color: '#fff', fontSize: 21 } })}
                                            </Box>
                                            <Typography sx={{ fontWeight: 700, color: HEAD, mb: 1, fontSize: '1rem' }}>{title}</Typography>
                                            <Typography sx={{ color: BODY, fontSize: 14, lineHeight: 1.7 }}>{desc}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* ════════════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════════════ */}
                <Box id="how-it-works" sx={{ bgcolor: '#fff', borderBottom: `1px solid ${BORD}` }}>
                    <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: HEAD, mb: 2 }}>
                                How It Works
                            </Typography>
                            <Typography sx={{ color: BODY, lineHeight: 1.7, maxWidth: 400, mx: 'auto' }}>
                                Four steps from buggy code to placement-ready developer.
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {STEPS.map(({ emoji, n, title, desc }, i) => (
                                <Grid item xs={12} sm={6} key={n}>
                                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                        <Box sx={{
                                            minWidth: 60, height: 60, borderRadius: '16px',
                                            bgcolor: ['#f0fdf4', '#eff6ff', '#fdf4ff', '#fff7ed'][i],
                                            border: `1px solid ${['#bbf7d0', '#bfdbfe', '#e9d5ff', '#fed7aa'][i]}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 26,
                                        }}>
                                            {emoji}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: 1.5, mb: 0.5, textTransform: 'uppercase' }}>
                                                Step {n}
                                            </Typography>
                                            <Typography sx={{ fontWeight: 700, color: HEAD, mb: 0.5, fontSize: '1.05rem' }}>{title}</Typography>
                                            <Typography sx={{ color: BODY, fontSize: 14, lineHeight: 1.7 }}>{desc}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* ════════════════════════════════════════════════════
            TESTIMONIALS
        ════════════════════════════════════════════════════ */}
                <Box id="testimonials" sx={{ bgcolor: '#f8fafc', borderBottom: `1px solid ${BORD}` }}>
                    <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
                        <Box sx={{ textAlign: 'center', mb: 8 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: HEAD, mb: 2 }}>
                                Loved by Students
                            </Typography>
                            <Typography sx={{ color: BODY }}>From first commit to first offer.</Typography>
                        </Box>
                        <Grid container spacing={3}>
                            {TESTIMONIALS.map(({ name, college, text, init, color }) => (
                                <Grid item xs={12} md={4} key={name}>
                                    <Card sx={{
                                        bgcolor: '#fff', borderRadius: '16px', height: '100%',
                                        border: `1px solid ${BORD}`,
                                        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                                        transition: 'all .2s ease',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 28px rgba(0,0,0,0.08)' },
                                    }}>
                                        <CardContent sx={{ p: 3.5 }}>
                                            {/* Stars */}
                                            <Typography sx={{ color: '#f59e0b', mb: 2, fontSize: 15 }}>★★★★★</Typography>
                                            <Typography sx={{ color: BODY, fontSize: 14, lineHeight: 1.8, mb: 3, fontStyle: 'italic' }}>
                                                {text}
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: color, width: 38, height: 38, fontWeight: 700, fontSize: 15 }}>
                                                    {init}
                                                </Avatar>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700, color: HEAD, fontSize: 14 }}>{name}</Typography>
                                                    <Typography sx={{ color: BODY, fontSize: 12 }}>{college}</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* ════════════════════════════════════════════════════
            CTA BANNER
        ════════════════════════════════════════════════════ */}
                <Box sx={{ bgcolor: '#fff' }}>
                    <Container maxWidth="md" sx={{ py: { xs: 10, md: 14 } }}>
                        <Box sx={{
                            background: GRAD, borderRadius: '20px',
                            p: { xs: 6, md: 9 }, textAlign: 'center',
                            boxShadow: '0 16px 50px rgba(16,185,129,0.25)',
                            position: 'relative', overflow: 'hidden',
                        }}>
                            {/* Subtle decorative circles */}
                            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
                            <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />

                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 2, position: 'relative' }}>
                                Start Improving Your Code Today
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 5, lineHeight: 1.7, maxWidth: 460, mx: 'auto', position: 'relative' }}>
                                Join thousands of students using AI to debug smarter, grow faster, and land their first dev job.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                                <Button
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        bgcolor: '#fff', color: '#10b981', fontWeight: 800,
                                        px: 4, py: 1.5, borderRadius: '12px', fontSize: '1rem',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#f0fdf4' },
                                    }}
                                >
                                    Create Free Account →
                                </Button>
                                <Button
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        color: '#fff', fontWeight: 600,
                                        border: '1px solid rgba(255,255,255,0.5)',
                                        px: 3.5, py: 1.5, borderRadius: '12px', fontSize: '1rem',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* ════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════ */}
                <Box sx={{ bgcolor: '#f8fafc', borderTop: `1px solid ${BORD}`, py: 5 }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Code sx={{ color: '#fff', fontSize: 17 }} />
                                </Box>
                                <Typography sx={{ fontWeight: 800, color: HEAD }}>CodeMentor AI</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 4 }}>
                                {['Features', 'How It Works', 'Testimonials'].map(t => (
                                    <Typography key={t} sx={{ color: BODY, fontSize: 14, cursor: 'pointer', '&:hover': { color: '#10b981' } }}>
                                        {t}
                                    </Typography>
                                ))}
                            </Box>
                            <Typography sx={{ color: '#94a3b8', fontSize: 13 }}>
                                © 2026 CodeMentor AI · AWS Hackathon
                            </Typography>
                        </Box>
                    </Container>
                </Box>

            </Box>
        </>
    );
}
