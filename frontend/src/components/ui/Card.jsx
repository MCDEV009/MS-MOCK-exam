import React from 'react';

/**
 * Card komponenti
 * Glassmorphism effekti bilan yoki oddiy
 * 
 * @param {boolean} glass - Glassmorphism effekti
 * @param {boolean} hover - Hover animatsiyasi
 * @param {string} padding - Padding o'lchami
 */
const Card = ({
    children,
    glass = false,
    hover = false,
    padding = 'md',
    className = '',
    onClick,
    ...props
}) => {
    // Padding o'lchamlari
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    // Birlashtirilgan klasslar
    const cardClasses = [
        glass ? 'card-glass' : 'card',
        hover ? 'card-hover cursor-pointer' : '',
        paddingClasses[padding],
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={cardClasses}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

// Card Header komponenti
export const CardHeader = ({ children, className = '', ...props }) => (
    <div
        className={`border-b border-[var(--border-color)] pb-4 mb-4 ${className}`}
        {...props}
    >
        {children}
    </div>
);

// Card Title komponenti
export const CardTitle = ({ children, className = '', ...props }) => (
    <h3
        className={`text-xl font-bold text-[var(--text-primary)] ${className}`}
        {...props}
    >
        {children}
    </h3>
);

// Card Description komponenti
export const CardDescription = ({ children, className = '', ...props }) => (
    <p
        className={`text-sm text-[var(--text-secondary)] mt-1 ${className}`}
        {...props}
    >
        {children}
    </p>
);

// Card Body komponenti
export const CardBody = ({ children, className = '', ...props }) => (
    <div className={className} {...props}>
        {children}
    </div>
);

// Card Footer komponenti
export const CardFooter = ({ children, className = '', ...props }) => (
    <div
        className={`border-t border-[var(--border-color)] pt-4 mt-4 ${className}`}
        {...props}
    >
        {children}
    </div>
);

// Statistika Card komponenti
export const StatCard = ({
    title,
    value,
    icon,
    trend,
    trendUp = true,
    color = 'primary',
    className = ''
}) => {
    const colorClasses = {
        primary: 'text-blue-600',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
        purple: 'text-purple-600'
    };

    return (
        <Card hover className={`relative overflow-hidden ${className}`}>
            {/* Background decoration */}
            <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8 ${colorClasses[color].replace('text-', 'bg-')}`}
            />

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
                    <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>{value}</p>

                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{trendUp ? '↑' : '↓'}</span>
                            <span>{trend}</span>
                        </div>
                    )}
                </div>

                {icon && (
                    <div className={`p-3 rounded-xl bg-[var(--bg-tertiary)] ${colorClasses[color]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default Card;
