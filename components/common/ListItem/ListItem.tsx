import React from 'react';
import cn from 'classnames';

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
title: string;
children: React.ReactNode;
}

const ListItem = ({title, children, className, ...props}: ListItemProps) => {
    return (<div className={cn('space-y-0.5 md:text-sm', className)} {...props}>
        <div className='text-gray-600 font-medium'>{title}</div>
        <div className='text-gray-900'>{children}</div>
    </div>)
}

export default ListItem;