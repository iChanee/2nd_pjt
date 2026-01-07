import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SessionContext = createContext();

const sessionReducer = ( state, action ) => {
    switch ( action.type ) {
        case 'LOGIN':
            return { ...state, user: action.payload, isLoggedIn: true };
        case 'LOGOUT':
            return { user: null, isLoggedIn: false };
        case 'UPDATE_USER':
            return { ...state, user: { ...state.user, ...action.payload } };
        default:
            return state;
    }
};

export const SessionProvider = ( { children } ) => {
    const [ state, dispatch ] = useReducer( sessionReducer, {
        user: null,
        isLoggedIn: false
    } );

    // localStorage 영속화
    useEffect( () => {
        const savedUser = localStorage.getItem( 'user' );
        if ( savedUser ) {
            dispatch( { type: 'LOGIN', payload: JSON.parse( savedUser ) } );
        }
    }, [] );

    useEffect( () => {
        if ( state.isLoggedIn ) {
            localStorage.setItem( 'user', JSON.stringify( state.user ) );
        } else {
            localStorage.removeItem( 'user' );
        }
    }, [ state.user ] );

    return (
        <SessionContext.Provider value={{ state, dispatch }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext( SessionContext );
    if ( !context ) throw new Error( 'useSession은 SessionProvider 안에서 사용하세요' );
    return context;
};
