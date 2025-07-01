import Link from 'next/link';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    [key: string]: any;
}

const Button = {
    Primary: ({ children, onClick, href, className = '', type = 'button', disabled, ...props }: ButtonProps) => {
        const baseClasses = 'bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md shadow-sm transition-all duration-200 ease-in-out';
        const classes = `${baseClasses} ${className}`;

        if (href) {
            return (
                <Link href={href} className={classes} {...props}>
                    {children}
                </Link>
            );
        }

        return (
            <button 
                type={type}
                onClick={onClick} 
                disabled={disabled}
                className={classes} 
                {...props}
            >
                {children}
            </button>
        );
    },
    Light: ({ children, onClick, href, className = '', type = 'button', disabled, ...props }: ButtonProps) => {
        const baseClasses = 'border border-border bg-background hover:bg-background-muted py-2 px-4 rounded-md shadow-sm transition-all duration-200 ease-in-out';
        const classes = `${baseClasses} ${className}`;

        if (href) {
            return (
                <Link href={href} className={classes} {...props}>
                    {children}
                </Link>
            );
        }

        return (
            <button 
                type={type}
                onClick={onClick} 
                disabled={disabled}
                className={classes} 
                {...props}
            >
                {children}
            </button>
        );
    },
    Select: ({ children, onClick, href, className = '', ...props }: ButtonProps) => {
        const baseClasses = 'bg-background hover:bg-background-muted text-foreground py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out';
        const classes = `${baseClasses} ${className}`;

        if (href) {
            return (
                <Link href={href} className={classes} {...props}>
                    {children}
                </Link>
            );
        }

        return (
            <button 
                type="button"
                onClick={onClick} 
                className={classes} 
                {...props}
            >
                {children}
            </button>
        );
    },
    SM: ({ children, onClick, href, className = '', type = 'button', disabled, ...props }: ButtonProps) => {
        const baseClasses = 'transition-colors duration-200 ease-in-out size-8 flex items-center justify-center hover:bg-background-muted rounded-md';
        const classes = `${baseClasses} ${className || 'hover:bg-background-muted'}`;

        if (href) {
            return (
                <Link href={href} className={classes} {...props}>
                    {children}
                </Link>
            );
        }

        return (
            <button 
                type={type}
                onClick={onClick} 
                disabled={disabled}
                className={classes} 
                {...props}
            >
                {children}
            </button>
        );
    }
};

export default Button;