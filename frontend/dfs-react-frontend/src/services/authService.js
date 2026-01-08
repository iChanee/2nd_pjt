import { post, get } from './api';

// 로그인
export const login = async ( credentials ) => {
    try {
        const response = await post( '/auth/login', credentials );

        if ( response.token ) {
            localStorage.setItem( 'authToken', response.token );
        }

        return response;
    } catch ( error ) {
        throw new Error( '로그인에 실패했습니다.' );
    }
};

// 회원가입
export const register = async ( userData ) => {
    try {
        const response = await post( '/auth/register', userData );

        if ( response.token ) {
            localStorage.setItem( 'authToken', response.token );
        }

        return response;
    } catch ( error ) {
        throw new Error( '회원가입에 실패했습니다.' );
    }
};

// 로그아웃
export const logout = () => {
    localStorage.removeItem( 'authToken' );
    localStorage.removeItem( 'user' );
};

// 사용자 정보 가져오기
export const getCurrentUser = async () => {
    try {
        return await get( '/auth/me' );
    } catch ( error ) {
        throw new Error( '사용자 정보를 가져올 수 없습니다.' );
    }
};

// 토큰 유효성 검사
export const validateToken = async () => {
    try {
        const token = localStorage.getItem( 'authToken' );
        if ( !token ) return false;

        await get( '/auth/validate' );
        return true;
    } catch ( error ) {
        localStorage.removeItem( 'authToken' );
        return false;
    }
};