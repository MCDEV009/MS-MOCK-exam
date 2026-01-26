import React from 'react';

/**
 * QuestionNav komponenti
 * Savollarga tez o'tish paneli
 * 
 * @param {number} totalQuestions - Jami savollar soni
 * @param {number} currentQuestion - Hozirgi savol indeksi (0-based)
 * @param {object} answers - Javoblar { questionIndex: answer }
 * @param {array} flaggedQuestions - Belgilangan savollar indekslari
 * @param {function} onQuestionClick - Savol bosilganda callback
 * @param {object} results - Natijalar (test tugagandan keyin) { questionIndex: isCorrect }
 */
const QuestionNav = ({
    totalQuestions,
    currentQuestion,
    answers = {},
    flaggedQuestions = [],
    onQuestionClick,
    results = null, // null = test davom etmoqda
    className = ''
}) => {
    // Savol holatini aniqlash
    const getQuestionStatus = (index) => {
        // Test tugagan bo'lsa - natijalar
        if (results !== null) {
            if (results[index] === true) return 'correct';
            if (results[index] === false) return 'incorrect';
            return 'unanswered';
        }

        // Test davom etmoqda
        if (index === currentQuestion) return 'current';
        if (flaggedQuestions.includes(index)) return 'flagged';
        if (answers[index] !== undefined) return 'answered';
        return 'unanswered';
    };

    // Savol tugmasini yaratish
    const renderQuestionButton = (index) => {
        const status = getQuestionStatus(index);

        return (
            <button
                key={index}
                onClick={() => onQuestionClick && onQuestionClick(index)}
                className={`question-nav-item ${status}`}
                title={`Savol ${index + 1}`}
                aria-label={`${index + 1}-savol, ${getStatusLabel(status)}`}
            >
                {index + 1}
            </button>
        );
    };

    // Status label
    const getStatusLabel = (status) => {
        const labels = {
            current: 'joriy savol',
            answered: 'javob berilgan',
            flagged: 'belgilangan',
            unanswered: 'javobsiz',
            correct: 'to\'g\'ri',
            incorrect: 'noto\'g\'ri'
        };
        return labels[status] || '';
    };

    // Statistika hisoblash
    const stats = {
        answered: Object.keys(answers).length,
        flagged: flaggedQuestions.length,
        remaining: totalQuestions - Object.keys(answers).length
    };

    return (
        <div className={`bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)] ${className}`}>
            {/* Sarlavha */}
            <h3 className="font-semibold text-sm text-[var(--text-secondary)] mb-3">
                Savollar
            </h3>

            {/* Savol tugmalari grid */}
            <div className="grid grid-cols-5 gap-2 mb-4">
                {Array.from({ length: totalQuestions }, (_, i) => renderQuestionButton(i))}
            </div>

            {/* Legend */}
            <div className="border-t border-[var(--border-color)] pt-3 mt-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-[var(--secondary)]"></span>
                        <span className="text-[var(--text-secondary)]">Javob berilgan ({stats.answered})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-[var(--warning)]"></span>
                        <span className="text-[var(--text-secondary)]">Belgilangan ({stats.flagged})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-[var(--primary)]"></span>
                        <span className="text-[var(--text-secondary)]">Joriy</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded border-2 border-[var(--border-color)]"></span>
                        <span className="text-[var(--text-secondary)]">Javobsiz ({stats.remaining})</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Compact versiya - mobile uchun
export const QuestionNavCompact = ({
    totalQuestions,
    currentQuestion,
    answers = {},
    onPrev,
    onNext
}) => {
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border-color)]">
            <button
                onClick={onPrev}
                disabled={currentQuestion === 0}
                className="btn btn-ghost btn-sm disabled:opacity-50"
                aria-label="Oldingi savol"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <div className="text-center">
                <div className="font-bold text-lg">
                    {currentQuestion + 1} / {totalQuestions}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                    {answeredCount} ta javob berildi
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={currentQuestion === totalQuestions - 1}
                className="btn btn-ghost btn-sm disabled:opacity-50"
                aria-label="Keyingi savol"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );
};

export default QuestionNav;
