import React from 'react';
import cn from 'classnames';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container = ({children, className}: ContainerProps) => {
    return <div className={cn('mx-auto w-[90%] md:w-[95%] px-2', className)}>
        {children}
    </div>
}

export default Container;