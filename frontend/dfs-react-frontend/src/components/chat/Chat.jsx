import React, { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { getFishEmoji } from '../../utils/helpers';

const Chat = ( { isVisible, onToggle } ) => {
    const { messages, isLoading, deleteMessage } = useChat();
    const { user } = useAuth();
    const messagesEndRef = useRef( null );

    // 새 메시지가 추가될 때마다 스크롤을 맨 아래로
    useEffect( () => {
        if ( messagesEndRef.current ) {
            messagesEndRef.current.scrollIntoView( { behavior: 'smooth' } );
        }
    }, [ messages ] );

    // 시간 포맷팅 함수
    const formatTime = ( dateString ) => {
        const date = new Date( dateString );
        const now = new Date();
        const diffInMinutes = Math.floor( ( now - date ) / ( 1000 * 60 ) );

        if ( diffInMinutes < 1 ) {
            return '방금 전';
        } else if ( diffInMinutes < 60 ) {
            return `${ diffInMinutes }분 전`;
        } else if ( diffInMinutes < 1440 ) {
            const hours = Math.floor( diffInMinutes / 60 );
            return `${ hours }시간 전`;
        } else {
            return date.toLocaleDateString( 'ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            } );
        }
    };

    // 메시지 삭제 핸들러
    const handleDeleteMessage = async ( messageId ) => {
        if ( window.confirm( '이 메시지를 삭제하시겠습니까?' ) ) {
            try {
                await deleteMessage( messageId );
            } catch ( error ) {
                alert( '메시지 삭제에 실패했습니다: ' + error.message );
            }
        }
    };

    if ( !isVisible ) return null;

    return (
        <div className="absolute top-16 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border-2 border-blue-200 z-50">
            {/* 채팅 헤더 */}
            <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">💬</span>
                    <h3 className="font-bold">어항 채팅</h3>
                    <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                        {messages.length}
                    </span>
                </div>
                <button
                    onClick={onToggle}
                    className="text-white hover:text-gray-200 text-xl font-bold"
                >
                    ×
                </button>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-3 h-80 bg-gradient-to-b from-blue-50 to-white">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <div className="text-2xl mb-2 animate-spin">💬</div>
                            <p>채팅 로딩 중...</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">🐠</div>
                            <p className="text-sm">아직 채팅이 없습니다</p>
                            <p className="text-xs text-gray-400">첫 번째 메시지를 보내보세요!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map( ( message ) => {
                            const isMyMessage = user && message.userId === user.id;

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${ isMyMessage ? 'justify-end' : 'justify-start' }`}
                                >
                                    <div
                                        className={`max-w-xs px-3 py-2 rounded-lg shadow-sm ${ isMyMessage
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-200'
                                            }`}
                                    >
                                        {/* 사용자 정보 */}
                                        {!isMyMessage && (
                                            <div className="flex items-center space-x-1 mb-1">
                                                <span className="text-lg">
                                                    {getFishEmoji( message.userFishType )}
                                                </span>
                                                <span className="text-xs font-bold text-gray-600">
                                                    {message.userName}
                                                </span>
                                            </div>
                                        )}

                                        {/* 메시지 내용 */}
                                        <p className={`text-sm ${ isMyMessage ? 'text-white' : 'text-gray-800' }`}>
                                            {message.message}
                                        </p>

                                        {/* 시간 및 삭제 버튼 */}
                                        <div className={`flex items-center justify-between mt-1 ${ isMyMessage ? 'flex-row-reverse' : 'flex-row'
                                            }`}>
                                            <span className={`text-xs ${ isMyMessage ? 'text-blue-200' : 'text-gray-400'
                                                }`}>
                                                {formatTime( message.createdAt )}
                                            </span>

                                            {isMyMessage && (
                                                <button
                                                    onClick={() => handleDeleteMessage( message.id )}
                                                    className="text-xs text-blue-200 hover:text-white ml-2"
                                                    title="메시지 삭제"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        } )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;