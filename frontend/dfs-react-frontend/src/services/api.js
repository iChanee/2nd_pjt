// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API 요청 헬퍼 함수
const apiRequest = async ( endpoint, options = {} ) => {
    const url = `${ API_BASE_URL }${ endpoint }`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // 인증 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem( 'authToken' );
    if ( token ) {
        config.headers.Authorization = `Bearer ${ token }`;
    }

    try {
        const response = await fetch( url, config );

        if ( !response.ok ) {
            throw new Error( `HTTP error! status: ${ response.status }` );
        }

        return await response.json();
    } catch ( error ) {
        console.error( 'API request failed:', error );
        throw error;
    }
};

// GET 요청
export const get = ( endpoint ) => apiRequest( endpoint );

// POST 요청
export const post = ( endpoint, data ) =>
    apiRequest( endpoint, {
        method: 'POST',
        body: JSON.stringify( data ),
    } );

// PUT 요청
export const put = ( endpoint, data ) =>
    apiRequest( endpoint, {
        method: 'PUT',
        body: JSON.stringify( data ),
    } );

// DELETE 요청
export const del = ( endpoint ) =>
    apiRequest( endpoint, {
        method: 'DELETE',
    } );

export default {
    get,
    post,
    put,
    delete: del,
};