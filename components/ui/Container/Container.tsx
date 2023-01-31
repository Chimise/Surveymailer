import React from 'react';
import cn from 'classnames';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    narrow?: boolean;
    fluid?: boolean;
}

const Container = ({children, className, narrow = false, fluid}: ContainerProps) => {
    return <div className={cn('mx-auto md:w-[95%]', {'px-2': !narrow && !fluid, 'px-4': !narrow && fluid, 'w-full': fluid, 'w-[90%]': !fluid}, className)}>
        {children}
    </div>
}

export default Container;