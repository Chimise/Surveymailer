import React from 'react';
import cn from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'filled' | 'outlined',
    full?: boolean;
    slim?: boolean;
}

const Button = ({className, variant = 'filled', children, full = false, slim = false, ...props}: ButtonProps) => {
    return (<button {...props} className={cn('text-center rounded-md focus:outline-none', {'border border-secondary text-secondary hover:bg-secondary hover:text-white': variant === 'outlined', 'bg-secondary text-white hover:bg-green-700': variant === 'filled'}, {'inline-block': !full, 'block w-full': full}, {'px-4 py-2': !slim, 'px-2 py-1': slim})}>
        {children}
    </button>)
}

export default Button;