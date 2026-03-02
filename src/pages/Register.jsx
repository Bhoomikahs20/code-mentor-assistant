import React, { useState } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button,
    InputAdornment, IconButton, Alert, Grid,
} from '@mui/material';
import { Email as EmailIcon, Lock as LockIcon, Person as PersonIcon, Visibility, VisibilityOff, School as CollegeIcon, Code as CodeIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', college: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
                name: form.name,
                email: form.email,
                college: form.college,
                password: form.password,
                skill_level: 'beginner',
                goal: 'placement',
            });
            login(data.user, data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err?.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Card sx={{ maxWidth: 480, width: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box sx={{ width: 56, height: 56, borderRadius: '14px', background: 'linear-gradient(135deg, #1976d2, #42a5f5)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                            <CodeIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" fontWeight={800}>Create your account</Typography>
                        <Typography variant="body2" color="text.secondary">Start your AI-powered coding journey</Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="College / University" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><CollegeIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Password" type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} size="small">{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                                    }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
                                    {loading ? 'Creating account...' : 'Create Account →'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none' }}>Sign in</Box>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
