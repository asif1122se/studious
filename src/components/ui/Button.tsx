import Link from 'next/link';
import { cn } from '@/lib/utils';
import Spinner from './Spinner';

interface ButtonProps {
  // Required props
  children: React.ReactNode;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  
  // Event handlers
  onClick?: () => void;
  
  // Link props
  href?: string;
  
  // Accessibility props
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  role?: string;
  
  // Catch-all for HTML attributes
  [key: string]: any;
}

const Button = {
    Primary: ({ 
        children, 
        onClick, 
        href, 
        className = '', 
        type = 'button', 
        disabled, 
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-expanded': ariaExpanded,
        'aria-pressed': ariaPressed,
        role,
        isLoading=false,
        ...props 
    }: ButtonProps) => {
        const baseClasses = 'bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
        const classes = `${baseClasses} ${className}`;

        if (href) {
            return (
                <Link 
                    href={href} 
                    className={classes} 
                    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                    aria-describedby={ariaDescribedby}
                    role={role || 'link'}
                    {...props}
                >
                    {children}
                </Link>
            );
        }

        if (isLoading) {
            return (<button 
                type={type}
                onClick={onClick} 
                disabled={true}
                className={`${classes} flex items-center`} 
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                aria-describedby={ariaDescribedby}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
                role={role || 'button'}
                {...props}
            >   
                <Spinner />
                <span>{children}</span>
            </button>)
        }

        return (
            <button 
                type={type}
                onClick={onClick} 
                disabled={disabled}
                className={classes} 
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                aria-describedby={ariaDescribedby}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
                role={role || 'button'}
                {...props}
            >
                {children}
            </button>
        );
    },
    Light: ({ 
        children, 
        onClick, 
        href, 
        className = '', 
        type = 'button', 
        disabled, 
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-expanded': ariaExpanded,
        'aria-pressed': ariaPressed,
        role,
        isLoading = false,
        ...props 
    }: ButtonProps) => {
        const baseClasses = 'border border-border bg-background hover:bg-background-muted py-2 px-4 rounded-md shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
        const classes = `${baseClasses} ${className}`;

        if (href) {
            return (
                <Link 
                    href={href} 
                    className={classes} 
                    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                    aria-describedby={ariaDescribedby}
                    role={role || 'link'}
                    {...props}
                >
                    {children}
                </Link>
            );
        }

        if (isLoading) {
            return (
                <button 
                    type={type}
                    onClick={onClick} 
                    disabled={true}
                    className={`${classes} flex items-center justify-center`} 
                    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                    aria-describedby={ariaDescribedby}
                    aria-expanded={ariaExpanded}
                    aria-pressed={ariaPressed}
                    role={role || 'button'}
                    {...props}
                >
                    <Spinner />
                    <span className="ml-2">{children}</span>
                </button>
            );
        }

        return (
            <button 
                type={type}
                onClick={onClick} 
                disabled={disabled}
                className={classes} 
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                aria-describedby={ariaDescribedby}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
                role={role || 'button'}
                {...props}
            >
                {children}
            </button>
        );
    },
    Select: ({ 
        children, 
        onClick, 
        href, 
        className = '', 
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-expanded': ariaExpanded,
        'aria-pressed': ariaPressed,
        role,
        isLoading = false,
        ...props 
    }: ButtonProps) => {
        const baseClasses = 'bg-background hover:bg-background-muted text-foreground py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
        const classes = `${baseClasses} ${className}`;

        if (href) {
            return (
                <Link 
                    href={href} 
                    className={classes} 
                    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                    aria-describedby={ariaDescribedby}
                    role={role || 'link'}
                    {...props}
                >
                    {children}
                </Link>
            );
        }

        if (isLoading) {
            return (
                <button 
                    type="button"
                    onClick={onClick} 
                    disabled={true}
                    className={`${classes} flex items-center justify-center`} 
                    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                    aria-describedby={ariaDescribedby}
                    aria-expanded={ariaExpanded}
                    aria-pressed={ariaPressed}
                    role={role || 'button'}
                    {...props}
                >
                    <Spinner />
                    <span className="ml-2">{children}</span>
                </button>
            );
        }

        return (
            <button 
                type="button"
                onClick={onClick} 
                className={classes} 
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                aria-describedby={ariaDescribedby}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
                role={role || 'button'}
                {...props}
            >
                {children}
            </button>
        );
    },
    SM: ({ 
        children, 
        onClick, 
        href, 
        className = '', 
        type = 'button', 
        disabled, 
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedby,
        'aria-expanded': ariaExpanded,
        'aria-pressed': ariaPressed,
        role,
        isLoading = false,
        ...props 
    }: ButtonProps) => {
        const baseClasses = 'transition-colors duration-200 ease-in-out size-8 flex items-center justify-center hover:bg-background-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
        const classes = `${baseClasses} ${className || 'hover:bg-background-muted'}`;

        if (href) {
            return (
                <Link 
                    href={href} 
                    className={classes} 
                    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                    aria-describedby={ariaDescribedby}
                    role={role || 'link'}
                    {...props}
                >
                    {children}
                </Link>
            );
        }

        if (isLoading) {
            return (
                <button 
                    type={type}
                    onClick={onClick} 
                    disabled={true}
                    className={classes} 
                    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                    aria-describedby={ariaDescribedby}
                    aria-expanded={ariaExpanded}
                    aria-pressed={ariaPressed}
                    role={role || 'button'}
                    {...props}
                >
                    <Spinner />
                </button>
            );
        }

        return (
            <button 
                type={type}
                onClick={onClick} 
                disabled={disabled}
                className={classes} 
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                aria-describedby={ariaDescribedby}
                aria-expanded={ariaExpanded}
                aria-pressed={ariaPressed}
                role={role || 'button'}
                {...props}
            >
                {children}
            </button>
        );
    }
};

export default Button;