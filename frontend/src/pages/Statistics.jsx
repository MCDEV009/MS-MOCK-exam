import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../config/axios';
import { StatCard } from '../components/ui/Card';

/**
 * Premium Statistics sahifasi
 * Grafiklar va batafsil tahlil
 */
const Statistics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Mock data
            setStats({
                totalTests: 25,
                averageScore: 78,
                bestScore: 96,
                totalTime: '12 soat 35 daqiqa',
                streak: 7,
                xp: 2450,
                level: 12,
                rank: 156,
                categoryScores: [
                    { name: 'Algebra', score: 85, total: 10, color: '#3B82F6' },
                    { name: 'Geometriya', score: 72, total: 8, color: '#10B981' },
                    { name: 'Trigonometriya', score: 68, total: 6, color: '#8B5CF6' },
                    { name: 'Funksiyalar', score: 81, total: 8, color: '#F59E0B' },
                    { name: 'Tenglamalar', score: 75, total: 7, color: '#EF4444' },
                    { name: 'Ehtimollar', score: 90, total: 5, color: '#06B6D4' },
                    { name: 'Mantiq', score: 82, total: 6, color: '#EC4899' }
                ],
                progressData: [
                    { date: '1-yanvar', score: 65 },
                    { date: '8-yanvar', score: 70 },
                    { date: '15-yanvar', score: 68 },
                    { date: '22-yanvar', score: 75 },
                    { date: '29-yanvar', score: 82 },
                    { date: '5-fevral', score: 78 },
                    { date: '12-fevral', score: 85 }
                ],
                achievements: [
                    { id: 1, name: 'Birinchi qadam', icon: '🎯', desc: 'Birinchi testni yakunlash', unlocked: true },
                    { id: 2, name: 'Streak master', icon: '🔥', desc: '7 kunlik streak', unlocked: true },
                    { id: 3, name: "A'lochi", icon: '⭐', desc: '90% dan yuqori ball', unlocked: true },
                    { id: 4, name: 'Matematika ustasi', icon: '🏆', desc: 'Barcha kategoriyalarda 80%+', unlocked: false },
                    { id: 5, name: 'Tezkor', icon: '⚡', desc: 'Testni 45 daqiqada tugatish', unlocked: false },
                    { id: 6, name: 'Perfeksionist', icon: '💯', desc: '100% ball olish', unlocked: false }
                ]
            });
        } catch (error) {
            console.error('Xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4 w-12 h-12"></div>
                    <p className="text-[var(--text-secondary)]">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
                        📊 Statistikangiz
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Batafsil o'quv tahlili va taraqqiyot ko'rsatkichlari
                    </p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <StatCard
                            title="Jami testlar"
                            value={stats.totalTests}
                            icon={<span className="text-2xl">📝</span>}
                            color="primary"
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <StatCard
                            title="O'rtacha ball"
                            value={`${stats.averageScore}%`}
                            icon={<span className="text-2xl">📈</span>}
                            color="success"
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <StatCard
                            title="Eng yuqori"
                            value={`${stats.bestScore}%`}
                            icon={<span className="text-2xl">🏆</span>}
                            color="warning"
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <StatCard
                            title="Reyting o'rni"
                            value={`#${stats.rank}`}
                            icon={<span className="text-2xl">🎖️</span>}
                            color="purple"
                        />
                    </div>
                </div>

                {/* Level & XP card */}
                <div className="card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {stats.level}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Level {stats.level}</h3>
                                <p className="text-[var(--text-secondary)]">{stats.xp} XP to'plangan</p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-md w-full">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-[var(--text-secondary)]">Keyingi level uchun</span>
                                <span className="font-semibold text-[var(--text-primary)]">550 XP</span>
                            </div>
                            <div className="progress-bar h-3">
                                <div className="progress-bar-fill" style={{ width: '78%' }}></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-2xl">
                            <span>🔥</span>
                            <span className="font-bold text-[var(--text-primary)]">{stats.streak}</span>
                            <span className="text-sm text-[var(--text-secondary)]">kunlik streak</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Category scores */}
                    <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                            📚 Kategoriyalar bo'yicha
                        </h3>
                        <div className="space-y-4">
                            {stats.categoryScores.map((cat, index) => (
                                <div key={cat.name} className="animate-fade-in" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-[var(--text-primary)]">{cat.name}</span>
                                        <span className="text-[var(--text-secondary)]">{cat.score}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${cat.score}%`,
                                                background: `linear-gradient(90deg, ${cat.color}, ${cat.color}dd)`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress chart placeholder */}
                    <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                            📈 Haftalik progress
                        </h3>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {stats.progressData.map((data, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-1000 hover:opacity-80"
                                        style={{
                                            height: `${data.score}%`,
                                            animationDelay: `${0.8 + index * 0.1}s`
                                        }}
                                    ></div>
                                    <span className="text-xs text-[var(--text-secondary)] truncate w-full text-center">
                                        {data.date.split('-')[0]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                        🏅 Yutuqlar
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {stats.achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`p-4 rounded-xl text-center transition-all ${achievement.unlocked
                                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800'
                                        : 'bg-[var(--bg-tertiary)] opacity-50 grayscale'
                                    }`}
                            >
                                <div className="text-4xl mb-2">{achievement.icon}</div>
                                <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                                    {achievement.name}
                                </h4>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    {achievement.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Kuchsiz tomonlar */}
                <div className="card p-6 mt-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                        💡 Tavsiyalar
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                                ⚠️ Kuchsiz tomonlar
                            </h4>
                            <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                                <li>• Trigonometriya (68%) - Ko'proq mashq qiling</li>
                                <li>• Geometriya (72%) - Teoremalarni takrorlang</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                                ✅ Kuchli tomonlar
                            </h4>
                            <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                                <li>• Ehtimollar nazariyasi (90%) - Ajoyib!</li>
                                <li>• Algebra (85%) - Yaxshi davom eting</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
