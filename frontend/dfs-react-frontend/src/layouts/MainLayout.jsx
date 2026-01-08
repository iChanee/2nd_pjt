import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/common/Header';

const MainLayout = ( { children } ) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className={`h-screen flex flex-col ${ isHomePage ? 'overflow-hidden' : '' }`}>
            <Header />
            <main className={`flex-1 relative ${ isHomePage ? 'overflow-hidden' : 'overflow-auto' }`}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;