import React, { useEffect, useRef } from 'react';

/**
 * Modal komponenti
 * Overlay bilan modal dialog
 * 
 * @param {boolean} isOpen - Modal ochiq holati
 * @param {function} onClose - Yopish funksiyasi
 * @param {string} title - Modal sarlavhasi
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} closeOnOverlay - Overlay bosganda yopish
 * @param {boolean} showCloseButton - Yopish tugmasini ko'rsatish
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    closeOnOverlay = true,
    showCloseButton = true,
    footer,
    className = ''
}) => {
    const modalRef = useRef(null);

    // ESC tugmasini bosganida yopish
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Modal ochiq bo'lsa scroll'ni bloklash
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Modal yopiq bo'lsa hech narsa ko'rsatmaslik
    if (!isOpen) return null;

    // O'lcham klasslari
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[90vw] w-full'
    };

    // Overlay bosganda yopish
    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                ref={modalRef}
                className={`modal-content w-full ${sizeClasses[size]} ${className}`}
            >
                {/* Modal Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                        {title && (
                            <h2
                                id="modal-title"
                                className="text-xl font-bold text-[var(--text-primary)]"
                            >
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                                aria-label="Yopish"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Modal Body */}
                <div className="p-6">
                    {children}
                </div>

                {/* Modal Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-color)]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// Confirm Modal komponenti
export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Tasdiqlash",
    message = "Bu amalni bajarishni xohlaysizmi?",
    confirmText = "Ha",
    cancelText = "Yo'q",
    variant = 'danger'
}) => {
    const variantClasses = {
        danger: 'btn-danger',
        primary: 'btn-primary',
        success: 'btn-success',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white'
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button onClick={onClose} className="btn btn-secondary">
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`btn ${variantClasses[variant]}`}
                    >
                        {confirmText}
                    </button>
                </>
            }
        >
            <p className="text-[var(--text-secondary)]">{message}</p>
        </Modal>
    );
};

export default Modal;
