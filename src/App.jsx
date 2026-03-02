import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme/theme';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CodeSubmit from './pages/CodeSubmit';
import Roadmap from './pages/Roadmap';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>

                    {/* ── PUBLIC ROUTES (landing + auth pages) ────────────── */}
                    <Route element={<PublicLayout />}>
                        <Route index path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* ── AUTHENTICATED ROUTES (product dashboard) ─────── */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AuthenticatedLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/submit" element={<CodeSubmit />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* ── FALLBACK ─────────────────────────────────────── */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
