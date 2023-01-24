import React from 'react';
import cn from 'classnames';

export interface SpinnerProps {
    size?: 'sm'|'md'|'lg';
    className?: string;
    foregroundColor?: string;
    backgroundColor?: string;
    borderSize?: string;
}


const Spinner = ({size = 'md', className, backgroundColor = 'before:border-gray-300', foregroundColor = 'after:border-b-slate-700', borderSize = 'before:border-2 after:border-2' }: SpinnerProps) => {
    return (<div className={cn('relative rounded-full before:absolute before:inset-0 before:rounded-full after:absolute after:inset-0 after:rounded-full after:border-transparent after:animate-spin', {'w-4 h-4': size === 'sm', 'w-8 h-8': size === 'md', 'w-10 h-10': size === 'lg'}, backgroundColor, foregroundColor, borderSize, className)} />)
}

export default Spinner;