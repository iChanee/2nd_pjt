import { post, get, put } from './api';

// 로그인
export const login = async ( credentials ) => {
    try {
        const response = await post( '/auth/login', credentials );

        if ( response.token ) {
            localStorage.setItem( 'authToken', response.token );
            localStorage.setItem( 'user', JSON.stringify( response.user ) );
        }

        return response;
    } catch ( error ) {
        throw new Error( error.message || '로그인에 실패했습니다.' );
    }
};

// 회원가입
export const register = async ( userData ) => {
    try {
        const response = await post( '/auth/register', userData );

        if ( response.token ) {
            localStorage.setItem( 'authToken', response.token );
            localStorage.setItem( 'user', JSON.stringify( response.user ) );
        }

        return response;
    } catch ( error ) {
        throw new Error( error.message || '회원가입에 실패했습니다.' );
    }
};

// 로그아웃
export const logout = async () => {
    console.log( '🔥 authService.logout 시작' );
    try {
        console.log( '🔥 /auth/logout API 호출 시작' );
        const result = await post( '/auth/logout', {} );
        console.log( '🔥 /auth/logout API 호출 성공:', result );
    } catch ( error ) {
        console.warn( '🔥 로그아웃 API 호출 실패:', error );
        console.warn( '🔥 에러 상세:', error.message );
        console.warn( '🔥 에러 응답:', error.response );
    } finally {
        console.log( '🔥 localStorage 정리 시작' );
        localStorage.removeItem( 'authToken' );
        localStorage.removeItem( 'user' );
        console.log( '🔥 authService.logout 완료' );
    }
};

// 사용자 정보 가져오기
export const getCurrentUser = async () => {
    try {
        const response = await get( '/auth/me' );
        localStorage.setItem( 'user', JSON.stringify( response ) );
        return response;
    } catch ( error ) {
        throw new Error( error.message || '사용자 정보를 가져올 수 없습니다.' );
    }
};

// 사용자 정보 수정
export const updateProfile = async ( userData ) => {
    try {
        const response = await put( '/auth/me', userData );
        localStorage.setItem( 'user', JSON.stringify( response ) );
        return response;
    } catch ( error ) {
        throw new Error( error.message || '프로필 수정에 실패했습니다.' );
    }
};

// 토큰 유효성 검사
export const validateToken = async () => {
    try {
        const token = localStorage.getItem( 'authToken' );
        if ( !token ) return { valid: false };

        const response = await post( '/auth/validate' );

        if ( response.valid && response.user ) {
            localStorage.setItem( 'user', JSON.stringify( response.user ) );
        }

        return response;
    } catch ( error ) {
        localStorage.removeItem( 'authToken' );
        localStorage.removeItem( 'user' );
        return { valid: false };
    }
};

// 로컬 스토리지에서 사용자 정보 가져오기
export const getStoredUser = () => {
    try {
        const user = localStorage.getItem( 'user' );
        return user ? JSON.parse( user ) : null;
    } catch ( error ) {
        console.error( 'Failed to parse stored user:', error );
        return null;
    }
};

// 로컬 스토리지에서 토큰 가져오기
export const getStoredToken = () => {
    return localStorage.getItem( 'authToken' );
};