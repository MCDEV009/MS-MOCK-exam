import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../config/axios';
import { QuestionCard } from '../components/test';
import { Button } from '../components/ui';

/**
 * Test Natijalari sahifasi
 * Batafsil tahlil va yechimlar
 */
const TestResults = () => {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showExplanations, setShowExplanations] = useState(false);

    useEffect(() => {
        fetchResults();
    }, [id]);

    const fetchResults = async () => {
        try {
            // Mock data
            setResult({
                id: id,
                score: 78,
                correctCount: 39,
                totalQuestions: 50,
                percentage: 78,
                isPassed: true,
                startTime: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
                endTime: new Date().toISOString(),
                timeSpent: '1 soat 25 daqiqa',
                xpEarned: 156,
                categoryScores: {
                    algebra: { correct: 8, total: 10, percentage: 80 },
                    geometriya: { correct: 6, total: 8, percentage: 75 },
                    trigonometriya: { correct: 4, total: 6, percentage: 67 },
                    funksiyalar: { correct: 7, total: 8, percentage: 88 },
                    tenglamalar: { correct: 5, total: 7, percentage: 71 },
                    ehtimollar: { correct: 5, total: 5, percentage: 100 },
                    mantiq: { correct: 4, total: 6, percentage: 67 }
                },
                questions: Array.from({ length: 50 }, (_, i) => ({
                    id: i + 1,
                    questionText: `Bu ${i + 1}-savol matni. Tenglamani yeching: x² + ${i + 2}x + ${i + 1} = 0`,
                    options: { A: 'Javob A', B: 'Javob B', C: 'Javob C', D: 'Javob D' },
                    correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
                    userAnswer: Math.random() > 0.22 ? ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] : null,
                    isCorrect: Math.random() > 0.22,
                    explanation: `Bu savolning yechimi: Formuladan foydalanib, x = ${Math.floor(Math.random() * 10)} yoki x = ${Math.floor(Math.random() * 10)} ekanligini topamiz.`,
                    category: ['algebra', 'geometriya', 'trigonometriya', 'funksiyalar', 'tenglamalar', 'ehtimollar', 'mantiq'][Math.floor(Math.random() * 7)]
                }))
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
                    <p className="text-[var(--text-secondary)]">Natijalar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    const categoryNames = {
        algebra: 'Algebra',
        geometriya: 'Geometriya',
        trigonometriya: 'Trigonometriya',
        funksiyalar: 'Funksiyalar',
        tenglamalar: 'Tenglamalar',
        ehtimollar: 'Ehtimollar',
        mantiq: 'Mantiq'
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-8">
            <div className="container mx-auto px-4">
                {/* Result header */}
                <div className={`card p-8 mb-8 text-center relative overflow-hidden animate-scale-in ${result.isPassed
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
                        : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30'
                    }`}>
                    {/* Confetti effect for pass */}
                    {result.isPassed && (
                        <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="absolute text-2xl animate-bounce"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        opacity: 0.6
                                    }}
                                >
                                    {['🎉', '✨', '🌟', '🎊'][Math.floor(Math.random() * 4)]}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="relative">
                        <div className="text-6xl mb-4">
                            {result.isPassed ? '🎉' : '💪'}
                        </div>
                        <h1 className="text-4xl font-bold mb-2">
                            {result.isPassed ? 'Tabriklaymiz!' : 'Yana urinib ko\'ring!'}
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)] mb-6">
                            {result.isPassed
                                ? 'Siz testdan muvaffaqiyatli o\'tdingiz!'
                                : 'Siz 60% dan kam ball to\'pladingiz'}
                        </p>

                        {/* Score circle */}
                        <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-white dark:bg-gray-800 shadow-xl mb-6">
                            <div className="text-center">
                                <div className={`text-5xl font-bold ${result.percentage >= 80 ? 'text-green-600' :
                                        result.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {result.percentage}%
                                </div>
                                <div className="text-sm text-[var(--text-secondary)]">
                                    {result.correctCount} / {result.totalQuestions}
                                </div>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="flex flex-wrap justify-center gap-6 text-center">
                            <div>
                                <div className="text-2xl font-bold text-[var(--text-primary)]">{result.timeSpent}</div>
                                <div className="text-sm text-[var(--text-secondary)]">Sarflangan vaqt</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-600">+{result.xpEarned} XP</div>
                                <div className="text-sm text-[var(--text-secondary)]">Ishlangan ball</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category breakdown */}
                <div className="card p-6 mb-8 animate-fade-in-up">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                        📊 Kategoriyalar bo'yicha natijalar
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(result.categoryScores).map(([key, value], index) => (
                            <div
                                key={key}
                                className="p-4 rounded-xl bg-[var(--bg-tertiary)] animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-[var(--text-primary)]">
                                        {categoryNames[key]}
                                    </span>
                                    <span className={`badge ${value.percentage >= 80 ? 'badge-success' :
                                            value.percentage >= 60 ? 'badge-warning' : 'badge-danger'
                                        }`}>
                                        {value.percentage}%
                                    </span>
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] mb-2">
                                    {value.correct} / {value.total} to'g'ri
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className={`progress-bar-fill ${value.percentage >= 80 ? '!bg-green-500' :
                                                value.percentage >= 60 ? '!bg-yellow-500' : '!bg-red-500'
                                            }`}
                                        style={{ width: `${value.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up">
                    <Button
                        variant="secondary"
                        onClick={() => setShowExplanations(!showExplanations)}
                    >
                        {showExplanations ? '📕 Yechimlarni yashirish' : '📖 Yechimlarni ko\'rish'}
                    </Button>
                    <Link to="/take-test">
                        <Button variant="primary">
                            🔄 Qayta topshirish
                        </Button>
                    </Link>
                    <Link to="/dashboard">
                        <Button variant="ghost">
                            🏠 Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Questions review */}
                {showExplanations && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">
                            📝 Barcha savollar
                        </h2>
                        {result.questions.map((question, index) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                questionNumber={index + 1}
                                selectedAnswer={question.userAnswer}
                                showResult={true}
                                correctAnswer={question.correctAnswer}
                                className={question.isCorrect ? '' : 'border-red-200 dark:border-red-800'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestResults;
