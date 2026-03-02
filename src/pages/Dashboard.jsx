import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box, Grid, Card, CardContent, Typography, Avatar, Chip,
    LinearProgress, Skeleton, Alert, Button,
} from "@mui/material";
import {
    LocalFireDepartment, Code, SportsEsports, TrendingUp,
    EmojiEvents, Refresh,
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/layout/PageContainer";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#e91e63", "#9c27b0", "#00bcd4"];

// ─── Stat Card ──────────────────────────────────────────────
function StatCard({ icon, label, value, color, unit = "" }) {
    return (
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", height: "100%" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
                <Box
                    sx={{
                        width: 52, height: 52, borderRadius: 2,
                        background: `${color}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    {icon}
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={800} color={color}>
                        {value ?? "—"}{unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

// ─── Error DNA Chart ─────────────────────────────────────────
function ErrorDNAChart({ breakdown }) {
    const data = Object.entries(breakdown || {}).map(([concept, freq]) => ({
        name: concept.replace(/_/g, " "),
        frequency: freq,
    }));

    if (!data.length)
        return (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                No error patterns yet. Submit some code to start tracking! 🚀
            </Typography>
        );

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v} occurrences`, "Frequency"]} />
                <Bar dataKey="frequency" radius={[0, 6, 6, 0]}>
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────
export default function Dashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        try {
            const { data } = await axios.get(
                `${API_BASE}/api/analytics/dashboard/${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStats(data);
        } catch (err) {
            setError("Could not load dashboard data. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboard(); }, [user]);

    const getInitials = (name = "") =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <PageContainer>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: 20, fontWeight: 700 }}>
                        {getInitials(user?.name)}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Welcome back, {user?.name} 👋
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.college || user?.email} · {user?.skill_level || "learner"}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                        icon={<LocalFireDepartment sx={{ color: "#ff5722 !important" }} />}
                        label={`${stats?.streak ?? 0} day streak`}
                        sx={{ fontWeight: 700, bgcolor: "#fff3e0" }}
                    />
                    <Button
                        size="small"
                        startIcon={<Refresh />}
                        onClick={fetchDashboard}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Error Banner */}
            {error && (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { icon: <LocalFireDepartment sx={{ color: "#ff5722" }} />, label: "Day Streak", value: stats?.streak, color: "#ff5722" },
                    { icon: <Code sx={{ color: "#1976d2" }} />, label: "Total Submissions", value: stats?.total_submissions, color: "#1976d2" },
                    { icon: <SportsEsports sx={{ color: "#9c27b0" }} />, label: "Games Played", value: stats?.games_played, color: "#9c27b0" },
                    { icon: <TrendingUp sx={{ color: "#4caf50" }} />, label: "Improvement", value: stats?.improvement_percent, color: "#4caf50", unit: "%" },
                ].map((card) => (
                    <Grid item xs={6} md={3} key={card.label}>
                        {loading ? (
                            <Card sx={{ borderRadius: 3, height: 100 }}>
                                <CardContent><Skeleton variant="rectangular" height={60} /></CardContent>
                            </Card>
                        ) : (
                            <StatCard {...card} />
                        )}
                    </Grid>
                ))}
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Error DNA */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                🧬 Error DNA
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Your most frequent error patterns
                            </Typography>
                            {loading ? (
                                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                            ) : (
                                <ErrorDNAChart breakdown={stats?.concept_breakdown} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Placement Readiness */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                🎯 Placement Readiness
                            </Typography>
                            {loading ? (
                                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                            ) : (
                                <>
                                    <Box sx={{ position: "relative", display: "inline-flex", mb: 3, mt: 1 }}>
                                        <Typography variant="h2" fontWeight={800} color="primary.main">
                                            {stats?.placement_readiness ?? 0}
                                            <Typography component="span" variant="h5" color="text.secondary">%</Typography>
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(stats?.placement_readiness ?? 0, 100)}
                                        sx={{ height: 10, borderRadius: 5, mb: 2 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {(stats?.placement_readiness ?? 0) < 40
                                            ? "Keep practicing! Every submission counts. 💪"
                                            : (stats?.placement_readiness ?? 0) < 75
                                                ? "Great progress! You're on the right track. 🚀"
                                                : "Outstanding! You're nearly placement-ready. 🏆"}
                                    </Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Top Recurring Concepts */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", mb: 4 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        🔁 Recurring Weak Spots
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                    ) : stats?.top_recurring_concepts?.length ? (
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                            {stats.top_recurring_concepts.map((c, i) => (
                                <Chip
                                    key={c.concept}
                                    label={`${c.concept.replace(/_/g, " ")} (${c.frequency}×)`}
                                    sx={{
                                        bgcolor: `${COLORS[i % COLORS.length]}18`,
                                        color: COLORS[i % COLORS.length],
                                        fontWeight: 600,
                                        border: `1px solid ${COLORS[i % COLORS.length]}40`,
                                    }}
                                    icon={c.is_recurring ? <EmojiEvents sx={{ color: `${COLORS[i % COLORS.length]} !important` }} /> : undefined}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No recurring patterns yet — submit more code to unlock insights! 🔍
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Grid container spacing={2}>
                {[
                    { label: "Submit Code", icon: "💻", path: "/submit", color: "#1976d2" },
                    { label: "View Roadmap", icon: "🗺️", path: "/roadmap", color: "#4caf50" },
                    { label: "Play Games", icon: "🎮", path: "/games", color: "#9c27b0" },
                    { label: "Full Analytics", icon: "📊", path: "/analytics", color: "#ff9800" },
                ].map(({ label, icon, path, color }) => (
                    <Grid item xs={6} md={3} key={label}>
                        <Card
                            onClick={() => navigate(path)}
                            sx={{
                                borderRadius: 3, cursor: "pointer", textAlign: "center",
                                p: 2, transition: "all .2s",
                                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
                            }}
                        >
                            <Typography fontSize={28}>{icon}</Typography>
                            <Typography variant="body2" fontWeight={600} color={color}>{label}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </PageContainer>
    );
}
