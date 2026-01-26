import React, { useState, useEffect } from 'react';
import apiClient from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

/**
 * Premium Leaderboard sahifasi
 * Viloyat va respublika reytingi
 */
const Leaderboard = () => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [timeRange, setTimeRange] = useState('all');

    // Viloyatlar
    const regions = [
        { value: '', label: "Barcha viloyatlar" },
        { value: 'toshkent', label: "Toshkent" },
        { value: 'samarqand', label: "Samarqand" },
        { value: 'buxoro', label: "Buxoro" },
        { value: 'andijon', label: "Andijon" },
        { value: 'fargona', label: "Farg'ona" },
        { value: 'namangan', label: "Namangan" },
        { value: 'xorazm', label: "Xorazm" },
        { value: 'qashqadaryo', label: "Qashqadaryo" },
        { value: 'surxondaryo', label: "Surxondaryo" },
        { value: 'navoiy', label: "Navoiy" },
        { value: 'jizzax', label: "Jizzax" },
        { value: 'sirdaryo', label: "Sirdaryo" },
        { value: 'qoraqalpogiston', label: "Qoraqalpog'iston" }
    ];

    useEffect(() => {
        fetchLeaderboard();
    }, [selectedRegion, timeRange]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            // Mock data (API tayyor bo'lmaganda)
            const mockData = Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                rank: i + 1,
                username: `user_${i + 1}`,
                avatar: null,
                averageScore: Math.round(95 - i * 0.5 + Math.random() * 5),
                testsCompleted: Math.round(50 - i * 0.3 + Math.random() * 10),
                xp: Math.round(10000 - i * 80 + Math.random() * 100),
                level: Math.max(1, Math.round(20 - i * 0.15)),
                region: regions[Math.floor(Math.random() * regions.length)].value || 'toshkent',
                streak: Math.max(0, Math.round(30 - i * 0.2 + Math.random() * 5))
            }));

            setLeaderboard(mockData);
        } catch (error) {
            console.error('Xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    // Medal ranglari
    const getMedalColor = (rank) => {
        if (rank === 1) return 'from-yellow-400 to-yellow-600';
        if (rank === 2) return 'from-gray-300 to-gray-500';
        if (rank === 3) return 'from-orange-400 to-orange-600';
        return 'from-blue-400 to-blue-600';
    };

    // Medal emoji
    const getMedalEmoji = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        🏆 Reyting
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Eng yaxshi natijalarni ko'rsatgan foydalanuvchilar reytingi
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in-up">
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="input max-w-xs"
                    >
                        {regions.map(region => (
                            <option key={region.value} value={region.value}>{region.label}</option>
                        ))}
                    </select>

                    <div className="flex rounded-xl overflow-hidden border border-[var(--border-color)]">
                        {[
                            { value: 'all', label: 'Barchasi' },
                            { value: 'week', label: 'Hafta' },
                            { value: 'month', label: 'Oy' }
                        ].map(range => (
                            <button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className={`px-4 py-2 font-medium transition-all ${timeRange === range.value
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top 3 cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {leaderboard.slice(0, 3).map((player, index) => (
                        <div
                            key={player.id}
                            className={`card p-6 text-center relative overflow-hidden animate-fade-in-up ${index === 0 ? 'md:order-2 md:-translate-y-4' : ''
                                } ${index === 1 ? 'md:order-1' : ''} ${index === 2 ? 'md:order-3' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Background decoration */}
                            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${getMedalColor(player.rank)}`} />

                            {/* Medal */}
                            <div className="text-5xl mb-4">{getMedalEmoji(player.rank)}</div>

                            {/* Avatar */}
                            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getMedalColor(player.rank)} flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg`}>
                                {player.username.charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                                {player.username}
                            </h3>
                            <p className="text-[var(--text-secondary)] text-sm mb-4">
                                Level {player.level}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-2xl font-bold text-[var(--primary)]">{player.averageScore}%</div>
                                    <div className="text-xs text-[var(--text-secondary)]">O'rtacha ball</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[var(--secondary)]">{player.xp}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">XP</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Full leaderboard */}
                <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="text-[var(--text-secondary)]">Yuklanmoqda...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--bg-tertiary)]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]">Foydalanuvchi</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-secondary)]">Level</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-secondary)]">O'rtacha ball</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-secondary)]">Testlar</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-secondary)]">XP</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-secondary)]">Streak</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {leaderboard.slice(3).map((player, index) => (
                                        <tr
                                            key={player.id}
                                            className={`hover:bg-[var(--bg-tertiary)] transition-colors ${player.username === user?.username ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-[var(--text-primary)]">{player.rank}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                        {player.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-[var(--text-primary)]">{player.username}</div>
                                                        <div className="text-xs text-[var(--text-secondary)]">
                                                            {regions.find(r => r.value === player.region)?.label || 'Noma\'lum'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="badge badge-primary">{player.level}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-bold ${player.averageScore >= 80 ? 'text-green-600' :
                                                        player.averageScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {player.averageScore}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-[var(--text-secondary)]">
                                                {player.testsCompleted}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-semibold text-purple-600">{player.xp}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="flex items-center justify-center gap-1">
                                                    🔥 {player.streak}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
