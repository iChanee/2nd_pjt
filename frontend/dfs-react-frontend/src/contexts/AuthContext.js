import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext( AuthContext );
    if ( !context ) {
        throw new Error( 'useAuth must be used within an AuthProvider' );
    }
    return context;
};

export const AuthProvider = ( { children } ) => {
    const [ user, setUser ] = useState( null );
    const [ isLoading, setIsLoading ] = useState( true );

    useEffect( () => {
        // 로컬 스토리지에서 사용자 정보 확인
        const savedUser = localStorage.getItem( 'user' );
        if ( savedUser ) {
            setUser( JSON.parse( savedUser ) );
        }
        setIsLoading( false );
    }, [] );

    const login = ( userData ) => {
        setUser( userData );
        localStorage.setItem( 'user', JSON.stringify( userData ) );
    };

    const logout = () => {
        setUser( null );
        localStorage.removeItem( 'user' );
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};