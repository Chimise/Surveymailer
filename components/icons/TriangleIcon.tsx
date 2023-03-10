import React from 'react';
import { IconProps } from '.';
import cn from 'classnames'


const TriangleIcon = ({className, ...props}: IconProps) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className={cn(className)} {...props} >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M5 4h14a2 2 0 0 1 1.84 2.75l-7.1 12.25a2 2 0 0 1 -3.5 0l-7.1 -12.25a2 2 0 0 1 1.75 -2.75" fill="currentColor"></path>
 </svg>)
}

export default TriangleIcon;