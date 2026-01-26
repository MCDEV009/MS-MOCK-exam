import React from 'react';

/**
 * QuestionCard komponenti
 * Savol va javob variantlarini ko'rsatish
 * 
 * @param {object} question - Savol ma'lumotlari
 * @param {number} questionNumber - Savol raqami
 * @param {string} selectedAnswer - Tanlangan javob
 * @param {function} onAnswerSelect - Javob tanlanganida callback
 * @param {boolean} isFlagged - Belgilanganmi
 * @param {function} onFlag - Belgilash tugmasi callback
 * @param {boolean} showResult - Natijani ko'rsatish
 * @param {string} correctAnswer - To'g'ri javob (natija ko'rsatilganda)
 */
const QuestionCard = ({
    question,
    questionNumber,
    selectedAnswer,
    onAnswerSelect,
    isFlagged = false,
    onFlag,
    showResult = false,
    correctAnswer,
    className = ''
}) => {
    // Variant harflari
    const optionLetters = ['A', 'B', 'C', 'D'];

    // Variant holatini aniqlash
    const getOptionStatus = (letter) => {
        if (!showResult) {
            return selectedAnswer === letter ? 'selected' : '';
        }

        // Natija ko'rsatilganda
        if (letter === correctAnswer) return 'correct';
        if (letter === selectedAnswer && letter !== correctAnswer) return 'incorrect';
        return '';
    };

    // Option style
    const getOptionClasses = (letter) => {
        const status = getOptionStatus(letter);
        const baseClasses = 'flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer';

        if (status === 'correct') {
            return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/20`;
        }
        if (status === 'incorrect') {
            return `${baseClasses} border-red-500 bg-red-50 dark:bg-red-900/20`;
        }
        if (status === 'selected') {
            return `${baseClasses} border-[var(--primary)] bg-blue-50 dark:bg-blue-900/20`;
        }
        return `${baseClasses} border-[var(--border-color)] hover:border-[var(--primary)] hover:bg-[var(--bg-tertiary)]`;
    };

    // Flag icon
    const FlagIcon = ({ filled }) => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
    );

    return (
        <div className={`bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-color)] ${className}`}>
            {/* Savol sarlavhasi */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--primary)] text-white font-bold">
                        {questionNumber}
                    </span>
                    <div>
                        <span className="text-sm text-[var(--text-secondary)]">Savol</span>
                        {question.difficulty && (
                            <span className={`ml-2 badge ${question.difficulty === 'easy' ? 'badge-success' :
                                    question.difficulty === 'medium' ? 'badge-warning' :
                                        'badge-danger'
                                }`}>
                                {question.difficulty === 'easy' ? 'Oson' :
                                    question.difficulty === 'medium' ? 'O\'rtacha' : 'Qiyin'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Flag tugmasi */}
                {onFlag && !showResult && (
                    <button
                        onClick={onFlag}
                        className={`p-2 rounded-lg transition-colors ${isFlagged
                                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                                : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                            }`}
                        title={isFlagged ? 'Belgini olib tashlash' : 'Belgilash'}
                    >
                        <FlagIcon filled={isFlagged} />
                    </button>
                )}
            </div>

            {/* Savol matni */}
            <div className="mb-6">
                <p className="text-lg text-[var(--text-primary)] leading-relaxed">
                    {question.questionText || question.question_uz}
                </p>

                {/* LaTeX formula (agar bo'lsa) */}
                {question.latex && (
                    <div className="mt-4 p-4 bg-[var(--bg-tertiary)] rounded-xl text-center font-mono">
                        {question.latex}
                    </div>
                )}

                {/* Rasm (agar bo'lsa) */}
                {question.image && (
                    <div className="mt-4 flex justify-center">
                        <img
                            src={question.image}
                            alt="Savol rasmi"
                            className="max-w-full h-auto rounded-xl border border-[var(--border-color)]"
                        />
                    </div>
                )}
            </div>

            {/* Javob variantlari */}
            <div className="space-y-3">
                {optionLetters.map((letter) => {
                    const optionText = question.options?.[letter] || question.options?.[letter.toLowerCase()];
                    if (!optionText) return null;

                    return (
                        <label
                            key={letter}
                            className={getOptionClasses(letter)}
                            onClick={() => !showResult && onAnswerSelect && onAnswerSelect(letter)}
                        >
                            {/* Radio button */}
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === letter
                                    ? 'border-[var(--primary)] bg-[var(--primary)]'
                                    : 'border-[var(--border-color)]'
                                }`}>
                                {selectedAnswer === letter && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                                {showResult && letter === correctAnswer && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                )}
                            </div>

                            {/* Variant harfi */}
                            <span className={`font-bold ${getOptionStatus(letter) === 'correct' ? 'text-green-600' :
                                    getOptionStatus(letter) === 'incorrect' ? 'text-red-600' :
                                        'text-[var(--text-secondary)]'
                                }`}>
                                {letter}.
                            </span>

                            {/* Variant matni */}
                            <span className="text-[var(--text-primary)]">{optionText}</span>
                        </label>
                    );
                })}
            </div>

            {/* Yechim (natija ko'rsatilganda) */}
            {showResult && question.explanation && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        📝 Yechim:
                    </h4>
                    <p className="text-[var(--text-secondary)]">{question.explanation}</p>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
