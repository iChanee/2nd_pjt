import React, { createContext, useContext, useState, useEffect } from 'react';
import chatService from '../services/chatService';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext( ChatContext );
    if ( !context ) {
        throw new Error( 'useChat must be used within a ChatProvider' );
    }
    return context;
};

export const ChatProvider = ( { children } ) => {
    const [ messages, setMessages ] = useState( [] );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ lastFetchTime, setLastFetchTime ] = useState( new Date() );
    const { isAuthenticated } = useAuth();

    // 초기 메시지 로드
    const loadRecentMessages = async () => {
        try {
            setIsLoading( true );
            const recentMessages = await chatService.getRecentMessages();
            console.log( '📨 최근 메시지 로드:', recentMessages );

            // 시간순으로 정렬 (오래된 것부터)
            const sortedMessages = recentMessages.sort( ( a, b ) =>
                new Date( a.createdAt ) - new Date( b.createdAt )
            );

            setMessages( sortedMessages );
            setLastFetchTime( new Date() );
        } catch ( error ) {
            console.error( '❌ 메시지 로드 실패:', error );
        } finally {
            setIsLoading( false );
        }
    };

    // 새 메시지 폴링
    const pollNewMessages = async () => {
        try {
            const newMessages = await chatService.getMessagesSince( lastFetchTime );
            if ( newMessages.length > 0 ) {
                console.log( '📨 새 메시지 수신:', newMessages );

                // 새 메시지를 기존 메시지에 추가
                setMessages( prev => {
                    const existingIds = new Set( prev.map( msg => msg.id ) );
                    const uniqueNewMessages = newMessages.filter( msg => !existingIds.has( msg.id ) );

                    if ( uniqueNewMessages.length > 0 ) {
                        return [ ...prev, ...uniqueNewMessages ].sort( ( a, b ) =>
                            new Date( a.createdAt ) - new Date( b.createdAt )
                        );
                    }
                    return prev;
                } );

                setLastFetchTime( new Date() );
            }
        } catch ( error ) {
            console.error( '❌ 새 메시지 폴링 실패:', error );
        }
    };

    // 메시지 전송
    const sendMessage = async ( message ) => {
        try {
            if ( !isAuthenticated ) {
                throw new Error( '로그인이 필요합니다.' );
            }

            if ( !message.trim() ) {
                throw new Error( '메시지를 입력해주세요.' );
            }

            console.log( '📤 메시지 전송 시도:', message );
            const sentMessage = await chatService.sendMessage( message.trim() );
            console.log( '✅ 메시지 전송 성공:', sentMessage );

            // 전송된 메시지를 즉시 목록에 추가
            setMessages( prev => {
                const existingIds = new Set( prev.map( msg => msg.id ) );
                if ( !existingIds.has( sentMessage.id ) ) {
                    return [ ...prev, sentMessage ].sort( ( a, b ) =>
                        new Date( a.createdAt ) - new Date( b.createdAt )
                    );
                }
                return prev;
            } );

            setLastFetchTime( new Date() );

            // 메시지 전송 후 즉시 새 메시지 폴링 (다른 사용자들이 볼 수 있도록)
            setTimeout( () => {
                pollNewMessages();
            }, 500 );

            return sentMessage;
        } catch ( error ) {
            console.error( '❌ 메시지 전송 실패:', error );
            throw error;
        }
    };

    // 메시지 삭제
    const deleteMessage = async ( messageId ) => {
        try {
            await chatService.deleteMessage( messageId );

            // 로컬 상태에서 메시지 제거
            setMessages( prev => prev.filter( msg => msg.id !== messageId ) );

            console.log( '🗑️ 메시지 삭제 완료:', messageId );
        } catch ( error ) {
            console.error( '❌ 메시지 삭제 실패:', error );
            throw error;
        }
    };

    // 초기 로드 및 폴링 설정
    useEffect( () => {
        let pollInterval;

        if ( isAuthenticated ) {
            // 초기 메시지 로드
            loadRecentMessages();

            // 2초마다 새 메시지 폴링 (더 빠른 실시간 채팅)
            pollInterval = setInterval( pollNewMessages, 2000 );
        } else {
            // 로그아웃 시 메시지 초기화
            setMessages( [] );
        }

        return () => {
            if ( pollInterval ) {
                clearInterval( pollInterval );
            }
        };
    }, [ isAuthenticated ] );

    // 컴포넌트 언마운트 시 정리
    useEffect( () => {
        return () => {
            setMessages( [] );
        };
    }, [] );

    const value = {
        messages,
        isLoading,
        sendMessage,
        deleteMessage,
        loadRecentMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};