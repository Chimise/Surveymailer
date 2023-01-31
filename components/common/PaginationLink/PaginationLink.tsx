import React from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    disabled?: boolean
}

const PaginationLink = ({onClick, href, className, children, disabled, ...props}: PaginationLinkProps) => {
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        const url = router.asPath.split('?')[0];
        event.preventDefault()
        if(!disabled && onClick) {
            onClick(event);
        }
        if(href && !disabled) {
            router.push(`${url}${href}`);
        }
        
    }
    return (<a onClick={handleClick} className={cn({'cursor-not-allowed': disabled}, className)} {...props}>
        {children}
    </a>)
}

export default PaginationLink;