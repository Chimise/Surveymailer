import React from 'react';
import cn from 'classnames';

type CustomListProps<T extends React.ElementType> =  {
    as?: T;
    children: React.ReactNode;
    className?: string;
  } & React.ComponentPropsWithoutRef<T>

const CustomList = <T extends React.ElementType = 'ul'>({as, children, className, ...props}: CustomListProps<T>) => {
    const childrenElement = React.Children.toArray(children);
    const Element = as || 'ul';
    return <Element className={cn('list-none pl-3 space-y-2', className)}  {...props}>
        {React.Children.map(childrenElement, (elem => {
            if(React.isValidElement(elem)) {
                return React.cloneElement(elem as React.ReactElement<HTMLElement>, {
                    className: `${elem.props.className} relative before:absolute before:w-3 before:h-3 before:top-[6px] before:-left-3 pl-3 before:bg-secondary before:rotate-45`,
                })
            }
            return elem;
        }))}
    </Element>
}

export default CustomList;