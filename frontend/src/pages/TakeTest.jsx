import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/axios';
import { Timer, QuestionNav, QuestionCard } from '../components/test';
import { Button, Modal, ConfirmModal } from '../components/ui';
import { useToast } from '../components/ui/Toast';

/**
 * Premium Test Sahifasi
 * Timer, navigation, auto-save, anti-cheat bilan
 */
const TakeTest = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Test konfiguratsiyasi
  const [testConfig, setTestConfig] = useState({
    subject: '',
    category: '',
    difficulty: '',
    language: 'uzbek',
    count: 50
  });

  // Test holatlari
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [testId, setTestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 daqiqa

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Anti-cheat
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Auto-save ref
  const autoSaveRef = useRef(null);

  // Kategoriyalar
  const categories = [
    { value: '', label: 'Barcha kategoriya' },
    { value: 'algebra', label: 'Algebra' },
    { value: 'geometriya', label: 'Geometriya' },
    { value: 'trigonometriya', label: 'Trigonometriya' },
    { value: 'funksiyalar', label: 'Funksiyalar' },
    { value: 'tenglamalar', label: 'Tenglamalar' },
    { value: 'ehtimollar', label: 'Ehtimollar nazariyasi' },
    { value: 'mantiq', label: 'Mantiq va statistika' }
  ];

  // Anti-cheat: Tab visibility
  useEffect(() => {
    if (!testStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            toast.warning('Ogohlantirish: Tab almashtirishlar ko\'p!');
          }
          return newCount;
        });
        setShowWarningModal(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [testStarted, toast]);

  // Anti-cheat: Copy prevention
  useEffect(() => {
    if (!testStarted) return;

    const preventCopy = (e) => {
      e.preventDefault();
      toast.warning('Nusxalash bloklangan!');
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
    };
  }, [testStarted, toast]);

  // Auto-save har 30 soniyada
  useEffect(() => {
    if (!testStarted || !testId) return;

    autoSaveRef.current = setInterval(async () => {
      try {
        await apiClient.post(`/api/tests/${testId}/save`, {
          answers,
          currentQuestion: currentQuestionIndex,
          timeLeft
        });
        // Silent save
      } catch (err) {
        console.error('Auto-save xatosi:', err);
      }
    }, 30000);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [testStarted, testId, answers, currentQuestionIndex, timeLeft]);

  // Test boshlash
  const startTest = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.post('/api/tests/start', testConfig);
      setQuestions(response.data.questions);
      setTestId(response.data.testId);
      setTestStarted(true);
      toast.success('Test boshlandi! Omad tilaymiz! 🍀');
    } catch (err) {
      setError(err.response?.data?.message || 'Testni boshlashda xatolik');
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Test yakunlash
  const submitTest = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/api/tests/${testId}/submit`, { answers });
      toast.success(`Test yakunlandi! Ballingiz: ${response.data.test.score}%`);
      navigate(`/test-results/${testId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Testni yuborishda xatolik');
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Vaqt tugadi
  const handleTimeUp = useCallback(() => {
    setShowTimeUpModal(true);
  }, []);

  // Javob tanlash
  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  // Flag toggle
  const handleFlagToggle = () => {
    setFlaggedQuestions(prev => {
      if (prev.includes(currentQuestionIndex)) {
        return prev.filter(i => i !== currentQuestionIndex);
      }
      return [...prev, currentQuestionIndex];
    });
  };

  // Navigation
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // TEST BOSHLASH EKRANI
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              🎯 Test Boshlash
            </h1>
            <p className="text-[var(--text-secondary)]">
              O'zingizga mos parametrlarni tanlang va testni boshlang
            </p>
          </div>

          <div className="card p-8 animate-fade-in-up">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 animate-shake">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); startTest(); }}>
              {/* Kategoriya */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  📚 Kategoriya
                </label>
                <select
                  value={testConfig.category}
                  onChange={(e) => setTestConfig({ ...testConfig, category: e.target.value })}
                  className="input"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Qiyinchilik */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  💪 Qiyinchilik darajasi
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '', label: 'Barchasi', color: 'bg-gray-100 dark:bg-gray-800' },
                    { value: 'easy', label: 'Oson', color: 'bg-green-100 dark:bg-green-900/30' },
                    { value: 'medium', label: "O'rtacha", color: 'bg-yellow-100 dark:bg-yellow-900/30' },
                    { value: 'hard', label: 'Qiyin', color: 'bg-red-100 dark:bg-red-900/30' }
                  ].map(diff => (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => setTestConfig({ ...testConfig, difficulty: diff.value })}
                      className={`p-3 rounded-xl border-2 font-medium transition-all ${testConfig.difficulty === diff.value
                          ? 'border-[var(--primary)] bg-blue-50 dark:bg-blue-900/30'
                          : `border-transparent ${diff.color}`
                        }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Til */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  🌐 Til
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'uzbek', label: "O'zbekcha", flag: '🇺🇿' },
                    { value: 'russian', label: 'Русский', flag: '🇷🇺' }
                  ].map(lang => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => setTestConfig({ ...testConfig, language: lang.value })}
                      className={`p-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${testConfig.language === lang.value
                          ? 'border-[var(--primary)] bg-blue-50 dark:bg-blue-900/30'
                          : 'border-[var(--border-color)] hover:border-[var(--primary)]'
                        }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Savollar soni */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  📝 Savollar soni
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="10"
                    value={testConfig.count}
                    onChange={(e) => setTestConfig({ ...testConfig, count: parseInt(e.target.value) })}
                    className="flex-1 accent-[var(--primary)]"
                  />
                  <span className="w-12 text-center font-bold text-xl text-[var(--primary)]">
                    {testConfig.count}
                  </span>
                </div>
              </div>

              {/* Info box */}
              <div className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">ℹ️ Muhim ma'lumot:</h3>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• Test 90 daqiqa davom etadi</li>
                  <li>• Javoblar har 30 soniyada avtomatik saqlanadi</li>
                  <li>• Tab almashtirishlar kuzatib boriladi</li>
                  <li>• O'tish balli: 60%</li>
                </ul>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                🚀 Testni Boshlash
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // TEST DAVOM ETMOQDA EKRANI
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Top bar - Timer va navigation */}
      <div className="sticky top-16 z-40 glass border-b border-[var(--glass-border)] py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Timer
                initialMinutes={90}
                onTimeUp={handleTimeUp}
                onTick={setTimeLeft}
              />
              <div className="hidden md:block text-sm text-[var(--text-secondary)]">
                Tab almashtirishlar: {tabSwitchCount}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowReviewModal(true)}
                className="hidden md:flex"
              >
                📋 Ko'rib chiqish
              </Button>
              <Button
                variant="success"
                onClick={() => setShowSubmitModal(true)}
              >
                ✅ Yakunlash
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Question navigation */}
          <aside className="lg:w-72 flex-shrink-0 order-2 lg:order-1">
            <div className="sticky top-36">
              <QuestionNav
                totalQuestions={questions.length}
                currentQuestion={currentQuestionIndex}
                answers={answers}
                flaggedQuestions={flaggedQuestions}
                onQuestionClick={goToQuestion}
              />
            </div>
          </aside>

          {/* Main - Question card */}
          <main className="flex-1 order-1 lg:order-2">
            {questions[currentQuestionIndex] && (
              <div className="animate-fade-in">
                <QuestionCard
                  question={questions[currentQuestionIndex]}
                  questionNumber={currentQuestionIndex + 1}
                  selectedAnswer={answers[questions[currentQuestionIndex].id]}
                  onAnswerSelect={handleAnswerSelect}
                  isFlagged={flaggedQuestions.includes(currentQuestionIndex)}
                  onFlag={handleFlagToggle}
                />

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="secondary"
                    onClick={goToPrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    ← Oldingi
                  </Button>

                  <span className="text-[var(--text-secondary)]">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>

                  <Button
                    variant="primary"
                    onClick={goToNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Keyingi →
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Submit confirmation modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={submitTest}
        title="Testni yakunlash"
        message={`Javob berilgan: ${Object.keys(answers).length} / ${questions.length}. Testni yakunlashni xohlaysizmi?`}
        confirmText="Ha, yakunlash"
        cancelText="Yo'q, davom etish"
        variant="success"
      />

      {/* Time up modal */}
      <Modal
        isOpen={showTimeUpModal}
        onClose={() => { }}
        title="⏰ Vaqt tugadi!"
        showCloseButton={false}
        footer={
          <Button variant="primary" onClick={submitTest} loading={loading}>
            Natijalarni ko'rish
          </Button>
        }
      >
        <p className="text-[var(--text-secondary)]">
          Test vaqti tugadi. Javoblaringiz avtomatik yuboriladi.
        </p>
      </Modal>

      {/* Tab switch warning modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="⚠️ Ogohlantirish!"
        size="sm"
      >
        <div className="text-center">
          <p className="text-[var(--text-secondary)] mb-4">
            Tab almashtirishlar kuzatib borilmoqda. Ko'p marta almashtirish testni bekor qilishga olib kelishi mumkin!
          </p>
          <p className="text-red-500 font-semibold">
            Almashtirishlar soni: {tabSwitchCount} / 3
          </p>
        </div>
      </Modal>

      {/* Review modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="📋 Javoblarni ko'rib chiqish"
        size="lg"
      >
        <div className="max-h-96 overflow-auto">
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:bg-[var(--bg-tertiary)] ${answers[q.id] ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                  }`}
                onClick={() => {
                  goToQuestion(index);
                  setShowReviewModal(false);
                }}
              >
                <span className="font-medium">Savol {index + 1}</span>
                <span className={`badge ${answers[q.id] ? 'badge-success' : 'badge-danger'}`}>
                  {answers[q.id] || 'Javobsiz'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TakeTest;
