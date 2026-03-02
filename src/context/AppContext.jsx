import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const mockUser = {
    id: 1,
    name: 'Arjun Sharma',
    email: 'arjun@example.com',
    college: 'IIT Bombay',
    avatar: null,
    streak: 12,
    totalSubmissions: 47,
    gamesPlayed: 23,
    improvementPercent: 78,
    placementReadiness: 72,
    language: 'English',
    github: 'github.com/arjun-sharma',
    badges: ['Bug Hunter', '7-Day Streak', 'First Submission', 'Python Pro'],
    skills: ['Python', 'JavaScript', 'DSA', 'React', 'SQL'],
};

const mockErrorDNA = [
    { type: 'Syntax Errors', count: 34, color: '#ef5350', percent: 28 },
    { type: 'Logic Errors', count: 28, color: '#ff9800', percent: 23 },
    { type: 'Runtime Errors', count: 22, color: '#ab47bc', percent: 18 },
    { type: 'Type Errors', count: 18, color: '#26c6da', percent: 15 },
    { type: 'Naming Issues', count: 12, color: '#66bb6a', percent: 10 },
    { type: 'Performance', count: 8, color: '#42a5f5', percent: 6 },
];

const mockSubmissions = [
    {
        id: 1,
        title: 'Two Sum Problem',
        language: 'Python',
        date: '2026-02-27',
        status: 'Fixed',
        errors: 2,
        score: 85,
    },
    {
        id: 2,
        title: 'Binary Search Tree',
        language: 'Java',
        date: '2026-02-26',
        status: 'Reviewed',
        errors: 5,
        score: 70,
    },
    {
        id: 3,
        title: 'React Counter App',
        language: 'JavaScript',
        date: '2026-02-25',
        status: 'Fixed',
        errors: 1,
        score: 92,
    },
    {
        id: 4,
        title: 'Linked List Reversal',
        language: 'C++',
        date: '2026-02-24',
        status: 'Pending',
        errors: 3,
        score: 60,
    },
    {
        id: 5,
        title: 'Fibonacci with Memoization',
        language: 'Python',
        date: '2026-02-23',
        status: 'Fixed',
        errors: 0,
        score: 98,
    },
];

const mockActivityData = [
    { day: 'Mon', submissions: 3, fixes: 2 },
    { day: 'Tue', submissions: 5, fixes: 4 },
    { day: 'Wed', submissions: 2, fixes: 1 },
    { day: 'Thu', submissions: 8, fixes: 7 },
    { day: 'Fri', submissions: 4, fixes: 3 },
    { day: 'Sat', submissions: 6, fixes: 5 },
    { day: 'Sun', submissions: 7, fixes: 6 },
];

const mockLeaderboard = [
    { rank: 1, name: 'Priya Patel', college: 'IIT Delhi', points: 2840, streak: 21, improvement: 94 },
    { rank: 2, name: 'Rahul Verma', college: 'NIT Trichy', points: 2650, streak: 18, improvement: 88 },
    { rank: 3, name: 'Arjun Sharma', college: 'IIT Bombay', points: 2480, streak: 12, improvement: 78, isMe: true },
    { rank: 4, name: 'Sneha Reddy', college: 'BITS Pilani', points: 2310, streak: 15, improvement: 82 },
    { rank: 5, name: 'Vikram Singh', college: 'IISc Bangalore', points: 2150, streak: 8, improvement: 71 },
    { rank: 6, name: 'Anjali Raje', college: 'IIT Madras', points: 1980, streak: 10, improvement: 65 },
    { rank: 7, name: 'Kartik Mehta', college: 'VIT Vellore', points: 1870, streak: 6, improvement: 59 },
    { rank: 8, name: 'Divya Nair', college: 'MIT Manipal', points: 1740, streak: 9, improvement: 67 },
    { rank: 9, name: 'Sai Kumar', college: 'NIT Warangal', points: 1620, streak: 4, improvement: 54 },
    { rank: 10, name: 'Riya Joshi', college: 'DTU Delhi', points: 1510, streak: 7, improvement: 61 },
];

const mockRoadmap = [
    {
        id: 1,
        title: 'Python Fundamentals',
        description: 'Master variables, loops, functions, and OOP basics',
        status: 'completed',
        time: '2 weeks',
        problems: 15,
    },
    {
        id: 2,
        title: 'Data Structures',
        description: 'Arrays, linked lists, stacks, queues, trees',
        status: 'completed',
        time: '3 weeks',
        problems: 25,
    },
    {
        id: 3,
        title: 'Algorithms & Complexity',
        description: 'Sorting, searching, dynamic programming, greedy',
        status: 'current',
        time: '4 weeks',
        problems: 30,
    },
    {
        id: 4,
        title: 'System Design Basics',
        description: 'Scalability, databases, caching, load balancing',
        status: 'locked',
        time: '3 weeks',
        problems: 20,
    },
    {
        id: 5,
        title: 'JavaScript & React',
        description: 'Frontend development, hooks, state management',
        status: 'locked',
        time: '5 weeks',
        problems: 35,
    },
    {
        id: 6,
        title: 'Mock Interviews',
        description: 'Full-length placement interview simulations',
        status: 'locked',
        time: '2 weeks',
        problems: 10,
    },
];

const mockGames = [
    {
        id: 1,
        title: 'Debug the Bug',
        description: 'Find and fix bugs in code snippets before time runs out',
        icon: '🐛',
        category: 'Debugging',
        difficulty: 'Medium',
        bestScore: 850,
        players: '12.4K',
        color: '#ef5350',
    },
    {
        id: 2,
        title: 'Predict Output',
        description: 'Guess what a code snippet outputs. Test your logic!',
        icon: '🎯',
        category: 'Logic',
        difficulty: 'Hard',
        bestScore: 720,
        players: '9.8K',
        color: '#ab47bc',
    },
    {
        id: 3,
        title: 'Code Jumble',
        description: 'Rearrange shuffled code lines into a working program',
        icon: '🧩',
        category: 'Problem Solving',
        difficulty: 'Easy',
        bestScore: 940,
        players: '15.2K',
        color: '#42a5f5',
    },
    {
        id: 4,
        title: 'Syntax Sprint',
        description: 'Type correct syntax as fast as possible. Beat the clock!',
        icon: '⚡',
        category: 'Speed',
        difficulty: 'Easy',
        bestScore: 1100,
        players: '20.1K',
        color: '#ff9800',
    },
    {
        id: 5,
        title: 'Algorithm Race',
        description: 'Implement algorithms faster than your peers',
        icon: '🏎️',
        category: 'Algorithms',
        difficulty: 'Hard',
        bestScore: 560,
        players: '7.3K',
        color: '#26c6da',
    },
    {
        id: 6,
        title: 'Code Trivia',
        description: 'Answer tricky coding questions and win points',
        icon: '🎓',
        category: 'Knowledge',
        difficulty: 'Medium',
        bestScore: 780,
        players: '11.5K',
        color: '#66bb6a',
    },
];

export function AppProvider({ children }) {
    const [user, setUser] = useState(mockUser);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [submissions, setSubmissions] = useState(mockSubmissions);
    const [errorDNA] = useState(mockErrorDNA);
    const [activityData] = useState(mockActivityData);
    const [leaderboard] = useState(mockLeaderboard);
    const [roadmap] = useState(mockRoadmap);
    const [games] = useState(mockGames);
    const [selectedLanguage, setSelectedLanguage] = useState('Python');
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);

    const login = (userData) => {
        setUser({ ...mockUser, ...userData });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const submitCode = async (code, language) => {
        setFeedbackLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const feedback = {
            explanation:
                'Your code has a few issues. The main problem is in the loop logic where you are not handling edge cases properly. The variable naming could also be improved for clarity.',
            fix: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
            errorDNA: 'Logic Error: Off-by-one in loop boundary. Variable naming needs improvement.',
            concept:
                'This problem uses the Hash Map technique. Instead of nested loops (O(n²)), we use a dictionary to achieve O(n) time complexity.',
            confidence: 87,
        };
        setCurrentFeedback(feedback);
        setFeedbackLoading(false);
        const newSubmission = {
            id: submissions.length + 1,
            title: 'New Submission',
            language,
            date: new Date().toISOString().split('T')[0],
            status: 'Fixed',
            errors: 2,
            score: Math.floor(Math.random() * 30) + 70,
        };
        setSubmissions([newSubmission, ...submissions]);
    };

    return (
        <AppContext.Provider
            value={{
                user,
                isAuthenticated,
                submissions,
                errorDNA,
                activityData,
                leaderboard,
                roadmap,
                games,
                selectedLanguage,
                setSelectedLanguage,
                feedbackLoading,
                currentFeedback,
                login,
                logout,
                submitCode,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}

export default AppContext;
