import React from 'react';
import Link from 'next/link';

const AuthLayout = ({children}:  {children: React.ReactNode}) => {
    return (<div className='flex flex-col w-screen h-screen'>
        <header className='h-14 w-full p-2 bg-primary flex justify-center items-center'>
        <Link href="/">
            <span className='font-display font-bold tracking-wide text-white transition-colors duration-150 text-xl'>
              Survey<span className='text-secondary'>Mailer</span>
            </span>
          </Link>
        </header>
        <main className='flex-1'>
            {children}
        </main>
    </div>)
}

export default AuthLayout;