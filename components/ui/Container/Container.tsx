import React from 'react';
import cn from 'classnames';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    narrow?: boolean;
}

const Container = ({children, className, narrow = false}: ContainerProps) => {
    return <div className={cn('mx-auto w-[90%] md:w-[95%]', {'px-2': !narrow}, className)}>
        {children}
    </div>
}

export default Container;