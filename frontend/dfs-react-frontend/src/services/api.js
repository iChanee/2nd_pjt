// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

        // // 디버깅을 위한 로그
        // console.log( 'API Request:', {
        //     url,
        //     method: config.method || 'GET',
        //     headers: config.headers,
        //     body: config.body
        // } );

        // 응답이 JSON이 아닐 수도 있으므로 확인
        const contentType = response.headers.get( 'content-type' );
        let data;

        if ( contentType && contentType.includes( 'application/json' ) ) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        // // 디버깅을 위한 로그
        // console.log( 'API Response:', {
        //     status: response.status,
        //     ok: response.ok,
        //     data
        // } );

        if ( !response.ok ) {
            // 백엔드에서 에러 메시지를 JSON으로 보내는 경우
            let errorMessage;

            if ( typeof data === 'object' ) {
                if ( data.error ) {
                    errorMessage = data.error;
                } else if ( data.details ) {
                    // 유효성 검사 에러의 경우
                    const fieldErrors = Object.values( data.details ).join( ', ' );
                    errorMessage = `입력 오류: ${ fieldErrors }`;
                } else {
                    errorMessage = `HTTP error! status: ${ response.status }`;
                }
            } else {
                errorMessage = data || `HTTP error! status: ${ response.status }`;
            }

            throw new Error( errorMessage );
        }

        return data;
    } catch ( error ) {
        console.error( 'API request failed:', error );
        throw error;
    }
};

// GET 요청
export const get = ( endpoint, options = {} ) => {
    // params가 있으면 URL에 쿼리 스트링으로 추가
    if ( options.params ) {
        const searchParams = new URLSearchParams( options.params );
        endpoint += `?${ searchParams.toString() }`;
        // params는 제거하고 나머지 옵션만 전달
        const { params, ...restOptions } = options;
        return apiRequest( endpoint, restOptions );
    }
    return apiRequest( endpoint, options );
};

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