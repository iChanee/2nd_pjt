import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import aquariumService from '../services/aquariumService';

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
    const [ session, setSession ] = useState( null ); // 어항 세션 상태 추가

    useEffect( () => {
        // 앱 시작 시 토큰 유효성 검사
        const initializeAuth = async () => {
            try {
                const storedUser = authService.getStoredUser();
                const storedToken = authService.getStoredToken();

                if ( storedToken && storedUser ) {
                    // 토큰 유효성 검사
                    const validation = await authService.validateToken();

                    if ( validation.valid ) {
                        setUser( validation.user || storedUser );
                        // 로그인 상태라면 어항 세션 확인
                        try {
                            const sessionData = await aquariumService.getMySession();
                            if ( sessionData && sessionData.id ) {
                                setSession( sessionData );
                            }
                        } catch ( error ) {
                            console.log( 'No active session found' );
                        }
                    } else {
                        // 토큰이 유효하지 않으면 로그아웃
                        authService.logout();
                        setUser( null );
                        setSession( null );
                    }
                }
            } catch ( error ) {
                console.error( 'Auth initialization failed:', error );
                authService.logout();
                setUser( null );
                setSession( null );
            } finally {
                setIsLoading( false );
            }
        };

        initializeAuth();

        // 앱 시작 시 이전 세션 정리 (브라우저가 비정상 종료된 경우 대비)
        const cleanupPreviousSessions = async () => {
            const needCleanup = localStorage.getItem( 'needSessionCleanup' );
            if ( needCleanup === 'true' ) {
                try {
                    await aquariumService.deleteSession();
                    localStorage.removeItem( 'needSessionCleanup' );
                    console.log( '이전 세션이 정리되었습니다.' );
                } catch ( error ) {
                    console.error( 'Failed to cleanup previous session:', error );
                }
            }
        };

        cleanupPreviousSessions();

        // 브라우저 종료/새로고침 시 정리 플래그 설정
        const handleBeforeUnload = ( event ) => {
            if ( session ) {
                localStorage.setItem( 'needSessionCleanup', 'true' );
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener( 'beforeunload', handleBeforeUnload );

        // 클린업
        return () => {
            window.removeEventListener( 'beforeunload', handleBeforeUnload );
        };
    }, [ session ] );

    const login = async ( credentials ) => {
        try {
            setIsLoading( true );
            const response = await authService.login( credentials );
            setUser( response.user );

            // 로그인 성공 후 자동으로 어항 입장
            try {
                const sessionData = await aquariumService.joinAquarium();
                setSession( sessionData );
                console.log( '어항에 입장했습니다:', sessionData );

                // FishContext에 로그인 성공 알림
                window.dispatchEvent( new CustomEvent( 'userLogin', {
                    detail: { user: response.user, session: sessionData }
                } ) );
            } catch ( sessionError ) {
                console.error( '어항 입장 실패:', sessionError );
                // 어항 입장 실패해도 로그인은 유지
            }

            return response;
        } catch ( error ) {
            throw error;
        } finally {
            setIsLoading( false );
        }
    };

    const register = async ( userData ) => {
        try {
            setIsLoading( true );
            const response = await authService.register( userData );
            setUser( response.user );

            // 회원가입 성공 후 자동으로 어항 입장
            try {
                const sessionData = await aquariumService.joinAquarium();
                setSession( sessionData );
                console.log( '어항에 입장했습니다:', sessionData );

                // FishContext에 로그인 성공 알림
                window.dispatchEvent( new CustomEvent( 'userLogin', {
                    detail: { user: response.user, session: sessionData }
                } ) );
            } catch ( sessionError ) {
                console.error( '어항 입장 실패:', sessionError );
            }

            return response;
        } catch ( error ) {
            throw error;
        } finally {
            setIsLoading( false );
        }
    };

    const logout = async () => {
        try {
            // 세션 완전 삭제
            if ( session ) {
                try {
                    await aquariumService.deleteSession();
                    setSession( null );
                    console.log( '세션이 삭제되었습니다.' );
                } catch ( error ) {
                    console.error( '세션 삭제 실패:', error );
                }
            }

            await authService.logout();

            // FishContext에 로그아웃 알림
            window.dispatchEvent( new CustomEvent( 'userLogout' ) );
        } catch ( error ) {
            console.error( 'Logout error:', error );
        } finally {
            setUser( null );
            setSession( null );
        }
    };

    const updateProfile = async ( userData ) => {
        try {
            const updatedUser = await authService.updateProfile( userData );
            setUser( updatedUser );
            return updatedUser;
        } catch ( error ) {
            throw error;
        }
    };

    const refreshUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser( currentUser );
            return currentUser;
        } catch ( error ) {
            console.error( 'Failed to refresh user:', error );
            throw error;
        }
    };

    // 어항 관련 함수들 추가
    const joinAquarium = async () => {
        try {
            const sessionData = await aquariumService.joinAquarium();
            setSession( sessionData );
            return sessionData;
        } catch ( error ) {
            console.error( '어항 입장 실패:', error );
            throw error;
        }
    };

    const leaveAquarium = async () => {
        try {
            await aquariumService.leaveAquarium();
            setSession( null );
        } catch ( error ) {
            console.error( '어항 퇴장 실패:', error );
            throw error;
        }
    };

    // 하트비트 설정 (30초마다)
    useEffect( () => {
        let heartbeatInterval;

        if ( session && user ) {
            heartbeatInterval = setInterval( async () => {
                try {
                    await aquariumService.heartbeat();
                } catch ( error ) {
                    console.error( 'Heartbeat failed:', error );
                    // 하트비트 실패 시 세션 상태 재확인
                    try {
                        const sessionData = await aquariumService.getMySession();
                        if ( !sessionData || !sessionData.id ) {
                            setSession( null );
                        }
                    } catch ( sessionError ) {
                        setSession( null );
                    }
                }
            }, 30000 ); // 30초마다
        }

        return () => {
            if ( heartbeatInterval ) {
                clearInterval( heartbeatInterval );
            }
        };
    }, [ session, user ] );

    const value = {
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        isInAquarium: !!session,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        joinAquarium,
        leaveAquarium
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};