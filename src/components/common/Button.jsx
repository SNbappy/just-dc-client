import { Link } from 'react-router-dom';

const Button = ({ to, href, children, variant = 'primary', className = '', onClick }) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-block text-center';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark hover:shadow-lg',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    };

    const buttonClasses = `${baseStyles} ${variants[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={buttonClasses}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={buttonClasses} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses}>
            {children}
        </button>
    );
};

export default Button;
