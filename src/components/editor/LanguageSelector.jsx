import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useApp } from '../../context/AppContext';

const languages = ['Python', 'JavaScript', 'Java', 'C++', 'C', 'TypeScript', 'Go', 'Rust'];

export default function LanguageSelector() {
    const { selectedLanguage, setSelectedLanguage } = useApp();

    return (
        <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Language</InputLabel>
            <Select
                value={selectedLanguage}
                label="Language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
            >
                {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor:
                                        lang === 'Python' ? '#3776ab'
                                            : lang === 'JavaScript' ? '#f7df1e'
                                                : lang === 'Java' ? '#e76f00'
                                                    : '#1976d2',
                                }}
                            />
                            {lang}
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
