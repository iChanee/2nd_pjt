import api from './api';

const chatService = {
    /**
     * 채팅 메시지 전송
     */
    async sendMessage( message ) {
        try {
            console.log( '💬 채팅 메시지 전송 시도:', message );
            const response = await api.post( '/chat/send', {
                message: message
            } );
            console.log( '💬 채팅 메시지 전송 성공:', response );
            return response;
        } catch ( error ) {
            console.error( '💬 채팅 메시지 전송 실패:', error );
            throw error;
        }
    },

    /**
     * 최근 채팅 메시지 조회
     */
    async getRecentMessages() {
        try {
            console.log( '💬 최근 메시지 조회 시도' );
            const response = await api.get( '/chat/messages' );
            console.log( '💬 최근 메시지 조회 성공:', response );
            return response;
        } catch ( error ) {
            console.error( '💬 채팅 메시지 조회 실패:', error );
            throw error;
        }
    },

    /**
     * 특정 시간 이후의 새 메시지 조회 (폴링용)
     */
    async getMessagesSince( since ) {
        try {
            console.log( '💬 새 메시지 조회 시도:', since );
            const response = await api.get( '/chat/messages/since', {
                params: {
                    since: since.toISOString().slice( 0, -1 ) // ISO 형식에서 Z 제거
                }
            } );
            console.log( '💬 새 메시지 조회 성공:', response );
            return response;
        } catch ( error ) {
            console.error( '💬 새 메시지 조회 실패:', error );
            throw error;
        }
    },

    /**
     * 메시지 삭제
     */
    async deleteMessage( messageId ) {
        try {
            console.log( '💬 메시지 삭제 시도:', messageId );
            const response = await api.delete( `/chat/messages/${ messageId }` );
            console.log( '💬 메시지 삭제 성공:', response );
            return response;
        } catch ( error ) {
            console.error( '💬 메시지 삭제 실패:', error );
            throw error;
        }
    }
};

export default chatService;