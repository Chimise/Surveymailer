import React from 'react';
import cn from 'classnames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Card = ({className, children, ...props}: CardProps) => {
    return (<div {...props} className={cn('bg-white shadow ring-1 ring-slate-100/10  rounded-md', className)}>
        {children}
    </div>)
}

export default Card;