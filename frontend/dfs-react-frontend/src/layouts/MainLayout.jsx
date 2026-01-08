import React from 'react';
import Header from '../components/common/Header';

const MainLayout = ( { children } ) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;