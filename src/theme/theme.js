import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#ff9800',
            light: '#ffb74d',
            dark: '#e65100',
            contrastText: '#fff',
        },
        background: {
            default: '#f9fafc',
            paper: '#ffffff',
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ff9800',
        },
        text: {
            primary: '#1a2027',
            secondary: '#546e7a',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    spacing: 8,
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    textTransform: 'none',
                    padding: '10px 24px',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
            },
        },
    },
});

export default theme;
