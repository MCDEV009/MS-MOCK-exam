import React, { useState, useEffect, useCallback } from 'react';

/**
 * Timer komponenti
 * 90 daqiqalik countdown timer
 * 
 * @param {number} initialMinutes - Boshlang'ich daqiqalar (default: 90)
 * @param {function} onTimeUp - Vaqt tugaganida callback
 * @param {function} onTick - Har bir tick'da callback (qolgan sekundlar)
 * @param {boolean} isPaused - Timer to'xtatilganmi
 */
const Timer = ({
    initialMinutes = 90,
    onTimeUp,
    onTick,
    isPaused = false,
    className = ''
}) => {
    // Sekundlarda saqlash
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const [isRunning, setIsRunning] = useState(true);

    // Timer logikasi
    useEffect(() => {
        if (isPaused || !isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;

                // Callback har bir tick'da
                if (onTick) {
                    onTick(newTime);
                }

                // Vaqt tugadi
                if (newTime <= 0) {
                    clearInterval(interval);
                    setIsRunning(false);
                    if (onTimeUp) {
                        onTimeUp();
                    }
                    return 0;
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, isRunning, onTimeUp, onTick]);

    // Vaqtni formatlash (MM:SS)
    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Timer holatini aniqlash
    const getTimerClass = () => {
        if (timeLeft <= 60) return 'timer-danger'; // 1 daqiqadan kam
        if (timeLeft <= 300) return 'timer-warning'; // 5 daqiqadan kam
        return '';
    };

    // Ikonlar
    const ClockIcon = () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="inline-block mr-2"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    );

    return (
        <div className={`timer ${getTimerClass()} flex items-center ${className}`}>
            <ClockIcon />
            <span>{formatTime(timeLeft)}</span>
        </div>
    );
};

// Compact Timer - kichikroq versiya
export const CompactTimer = ({ timeLeft, className = '' }) => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const getTimerClass = () => {
        if (timeLeft <= 60) return 'text-red-500';
        if (timeLeft <= 300) return 'text-yellow-500';
        return 'text-[var(--text-primary)]';
    };

    return (
        <span className={`font-mono font-bold ${getTimerClass()} ${className}`}>
            {formatted}
        </span>
    );
};

export default Timer;
