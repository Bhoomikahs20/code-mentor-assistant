import { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import {
    Box, Card, CardContent, TextField, Button, Typography,
    InputAdornment, IconButton, Alert, Divider, Link, CircularProgress,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff, Code } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError("Please fill in both fields."); return; }

        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
            const { access_token, user } = data;
            login(user, access_token);
            navigate("/dashboard");
        } catch (err) {
            const msg = err?.response?.data?.detail || "Login failed. Check your credentials.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #e3f0ff 0%, #f9fafc 60%, #fff3e0 100%)",
                px: 2,
            }}
        >
            <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 3, boxShadow: "0 8px 40px rgba(25,118,210,0.12)" }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Logo */}
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Code sx={{ color: "primary.main", fontSize: 32 }} />
                            <Typography variant="h5" fontWeight={700} color="primary.main">
                                CodeMentor AI
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to continue your learning journey
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPass((p) => !p)} edge="end">
                                            {showPass ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            sx={{ borderRadius: 2, py: 1.5, fontWeight: 700, fontSize: "1rem" }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Don&apos;t have an account?{" "}
                            <Link component={RouterLink} to="/register" color="primary" fontWeight={600}>
                                Create one free
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
