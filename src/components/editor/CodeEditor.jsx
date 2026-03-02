import React, { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { useApp } from '../../context/AppContext';

const placeholderCode = {
    Python: `def two_sum(nums, target):
    # TODO: implement your solution
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    JavaScript: `function twoSum(nums, target) {
  // TODO: implement your solution
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
    Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // TODO: implement
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
    'C++': `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // TODO: implement
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}`,
};

export default function CodeEditor({ code, setCode }) {
    const { selectedLanguage } = useApp();
    const defaultCode = placeholderCode[selectedLanguage] || placeholderCode.Python;
    const currentCode = code || defaultCode;

    const lineCount = currentCode.split('\n').length;

    return (
        <Box
            sx={{
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#1e1e2e',
                fontFamily: '"Fira Code", "Courier New", monospace',
            }}
        >
            {/* Editor Header */}
            <Box
                sx={{
                    bgcolor: '#2d2d3f',
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                    {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                        <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
                    ))}
                </Box>
                <Typography
                    variant="caption"
                    sx={{ color: 'rgba(255,255,255,0.5)', ml: 1, fontFamily: 'monospace' }}
                >
                    solution.{selectedLanguage.toLowerCase() === 'python' ? 'py' : selectedLanguage.toLowerCase() === 'javascript' ? 'js' : selectedLanguage.toLowerCase() === 'java' ? 'java' : 'cpp'}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip
                    label={selectedLanguage}
                    size="small"
                    sx={{ bgcolor: 'rgba(25, 118, 210, 0.3)', color: '#90caf9', fontWeight: 600, fontSize: '0.7rem' }}
                />
            </Box>

            {/* Code Editor Area */}
            <Box sx={{ display: 'flex', minHeight: 320 }}>
                {/* Line Numbers */}
                <Box
                    sx={{
                        bgcolor: '#252535',
                        px: 1.5,
                        pt: 1,
                        minWidth: 44,
                        textAlign: 'right',
                        userSelect: 'none',
                    }}
                >
                    {Array.from({ length: lineCount }, (_, i) => (
                        <Typography
                            key={i}
                            variant="caption"
                            sx={{
                                display: 'block',
                                color: 'rgba(255,255,255,0.2)',
                                lineHeight: '20px',
                                fontFamily: 'monospace',
                            }}
                        >
                            {i + 1}
                        </Typography>
                    ))}
                </Box>

                {/* Textarea */}
                <Box
                    component="textarea"
                    value={currentCode}
                    onChange={(e) => setCode && setCode(e.target.value)}
                    spellCheck={false}
                    sx={{
                        flex: 1,
                        bgcolor: 'transparent',
                        color: '#e2e8f0',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: '"Fira Code", "Courier New", monospace',
                        fontSize: '0.85rem',
                        lineHeight: '20px',
                        p: 1,
                        pt: 1,
                        pl: 1.5,
                        minHeight: 320,
                        '&::placeholder': { color: 'rgba(255,255,255,0.3)' },
                    }}
                />
            </Box>
        </Box>
    );
}
