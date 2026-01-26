import React from 'react';

/**
 * Button komponenti
 * Turli xil variantlar va o'lchamlar bilan
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Yuklanish holati
 * @param {boolean} disabled - O'chirilgan holat
 * @param {boolean} fullWidth - To'liq kenglik
 * @param {React.ReactNode} icon - Ikon (left side)
 * @param {React.ReactNode} iconRight - Ikon (right side)
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    iconRight,
    className = '',
    type = 'button',
    onClick,
    ...props
}) => {
    // Variant klasslarni aniqlash
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        danger: 'btn-danger',
        ghost: 'btn-ghost'
    };

    // O'lcham klasslarni aniqlash
    const sizeClasses = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };

    // Birlashtirilgan klasslar
    const buttonClasses = [
        'btn',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {/* Loading spinner */}
            {loading && (
                <span className="spinner" style={{ width: '1rem', height: '1rem' }} />
            )}

            {/* Left icon */}
            {!loading && icon && <span className="btn-icon-left">{icon}</span>}

            {/* Button text */}
            {children}

            {/* Right icon */}
            {iconRight && <span className="btn-icon-right">{iconRight}</span>}
        </button>
    );
};

// Icon-only button komponenti
export const IconButton = ({
    children,
    variant = 'ghost',
    size = 'md',
    className = '',
    ...props
}) => {
    const sizeStyles = {
        sm: { width: '2rem', height: '2rem' },
        md: { width: '2.5rem', height: '2.5rem' },
        lg: { width: '3rem', height: '3rem' }
    };

    return (
        <Button
            variant={variant}
            className={`btn-icon ${className}`}
            style={sizeStyles[size]}
            {...props}
        >
            {children}
        </Button>
    );
};

export default Button;
