import api from './api';

const aquariumService = {
    // 어항 입장
    joinAquarium: async () => {
        const response = await api.post( '/aquarium/join' );
        return response.data;
    },

    // 어항 퇴장
    leaveAquarium: async () => {
        const response = await api.post( '/aquarium/leave' );
        return response.data;
    },

    // 세션 완전 삭제 (로그아웃 시 사용)
    deleteSession: async () => {
        const response = await api.delete( '/aquarium/session' );
        return response.data;
    },

    // 내 세션 정보 조회
    getMySession: async () => {
        const response = await api.get( '/aquarium/my-session' );
        return response.data;
    },

    // 모든 온라인 물고기 조회 (인증 불필요)
    getAllFishes: async () => {
        try {
            console.log( '🌐 API 호출 시작: /aquarium/fishes' );
            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

            // 인증 없이 직접 fetch 사용
            const response = await fetch( `${ API_BASE_URL }/aquarium/fishes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            } );

            console.log( '🌐 fetch 응답:', response );
            console.log( '🌐 응답 상태:', response.status );
            console.log( '🌐 응답 OK:', response.ok );

            if ( !response.ok ) {
                throw new Error( `HTTP error! status: ${ response.status }` );
            }

            const data = await response.json();
            console.log( '🌐 파싱된 데이터:', data );
            console.log( '🌐 데이터 타입:', typeof data );
            console.log( '🌐 배열인가?', Array.isArray( data ) );

            return data;
        } catch ( error ) {
            console.error( '🌐 API 호출 실패:', error );
            console.error( '🌐 에러 응답:', error.response?.data );
            console.error( '🌐 에러 상태:', error.response?.status );
            throw error;
        }
    },

    // 물고기 위치 업데이트
    updatePosition: async ( x, y ) => {
        const response = await api.put( '/aquarium/position', { x, y } );
        return response.data;
    },

    // 하트비트 (활동 업데이트)
    heartbeat: async () => {
        const response = await api.post( '/aquarium/heartbeat' );
        return response.data;
    },

    // 어항 상태 조회
    getAquariumStatus: async () => {
        const response = await api.get( '/aquarium/status' );
        return response.data;
    }
};

export default aquariumService;