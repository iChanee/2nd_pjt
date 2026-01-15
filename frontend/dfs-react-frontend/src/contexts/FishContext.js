import React, { createContext, useContext, useState, useEffect } from 'react';
import aquariumService from '../services/aquariumService';
import { useAuth } from './AuthContext';

const FishContext = createContext();

export const useFish = () => {
    const context = useContext( FishContext );
    if ( !context ) {
        throw new Error( 'useFish must be used within a FishProvider' );
    }
    return context;
};

export const FishProvider = ( { children } ) => {
    const [ fishes, setFishes ] = useState( [] );
    const [ tankSettings, setTankSettings ] = useState( {
        theme: 'ocean',
        capacity: 10,
        temperature: 24
    } );
    const [ fishMessages, setFishMessages ] = useState( {} ); // 물고기별 메시지 저장
    const [ isFeeding, setIsFeeding ] = useState( false ); // 먹이주기 상태
    const [ logoutAnimation, setLogoutAnimation ] = useState( null ); // 로그아웃 애니메이션 상태
    const [ isLoading, setIsLoading ] = useState( false );

    // AuthContext에서 로그인 상태 가져오기
    const { isAuthenticated, user, session } = useAuth();

    // 서버에서 모든 온라인 물고기 데이터 가져오기
    const fetchAllFishes = async () => {
        try {
            setIsLoading( true );
            console.log( '🔍 서버에서 물고기 데이터 가져오는 중...' );
            console.log( '🔍 현재 시간:', new Date().toISOString() );

            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

            // 직접 fetch로 테스트 (CORS 및 네트워크 문제 확인)
            console.log( '🌐 직접 fetch 테스트 시작' );
            const testResponse = await fetch( `${ API_BASE_URL }/aquarium/fishes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            } );

            console.log( '🌐 테스트 응답 상태:', testResponse.status );
            console.log( '🌐 테스트 응답 OK:', testResponse.ok );

            if ( !testResponse.ok ) {
                throw new Error( `HTTP error! status: ${ testResponse.status }` );
            }

            const testData = await testResponse.json();
            console.log( '🌐 테스트 데이터:', testData );

            const fishSessions = testData;
            console.log( '🐠 서버에서 받은 데이터:', fishSessions );
            console.log( '🐠 데이터 타입:', typeof fishSessions );
            console.log( '🐠 데이터가 배열인가?', Array.isArray( fishSessions ) );
            console.log( '🐠 데이터 키들:', fishSessions ? Object.keys( fishSessions ) : 'null/undefined' );
            console.log( '🐠 JSON 문자열:', JSON.stringify( fishSessions, null, 2 ) );

            // 데이터가 배열이 아니거나 undefined인 경우 처리
            if ( !fishSessions || !Array.isArray( fishSessions ) ) {
                console.warn( '⚠️ 받은 데이터가 배열이 아닙니다:', fishSessions );
                setFishes( [] );
                return;
            }

            // 서버 데이터를 FishContext 형식으로 변환
            const formattedFishes = fishSessions.map( session => ( {
                id: session.id,
                userId: session.user.id,
                name: session.user.name,
                type: session.user.fishType,
                position: {
                    x: parseFloat( session.positionX ),
                    y: parseFloat( session.positionY )
                },
                joinedAt: new Date( session.joinedAt ),
                sessionToken: session.sessionToken, // 본인 세션인 경우에만 있음
                isOnline: session.isOnline,
                lastActivityAt: new Date( session.lastActivityAt )
            } ) );

            console.log( '🎯 변환된 물고기 데이터:', formattedFishes );
            setFishes( formattedFishes );
        } catch ( error ) {
            console.error( '❌ 물고기 데이터 가져오기 실패:', error );
            console.error( '❌ 에러 상세:', error.message );
            console.error( '❌ 에러 스택:', error.stack );

            // 에러 시 빈 배열로 설정 (테스트 데이터 제거)
            console.log( '🚫 에러로 인해 빈 배열 설정' );
            setFishes( [] );
        } finally {
            setIsLoading( false );
        }
    };

    // 주기적으로 물고기 데이터 업데이트 (서버 연동 복구)
    useEffect( () => {
        let interval;

        console.log( '🔄 FishContext useEffect 시작 - 서버 연동 모드로 복구' );

        // 초기 데이터 로드
        console.log( '🔄 초기 데이터 로드 시작' );
        fetchAllFishes();

        // 5초마다 업데이트
        console.log( '🔄 5초 간격 업데이트 설정' );
        interval = setInterval( () => {
            console.log( '🔄 정기 업데이트 실행' );
            fetchAllFishes();
        }, 5000 );

        // 사용자 로그아웃 시 즉시 새로고침을 위한 이벤트 리스너
        const handleUserLogout = () => {
            console.log( '🔄 사용자 로그아웃 감지 - 물고기 데이터 즉시 새로고침' );
            fetchAllFishes();
        };

        // 사용자 로그인 시 즉시 새로고침을 위한 이벤트 리스너
        const handleUserLogin = ( event ) => {
            console.log( '🔄 사용자 로그인 감지 - 물고기 데이터 즉시 새로고침' );
            console.log( '🔄 로그인 이벤트 상세:', event.detail );

            // 로그인 후 2초 대기 후 새로고침 (서버 세션 생성 완료 대기)
            setTimeout( () => {
                console.log( '🔄 로그인 이벤트 후 지연 새로고침 실행' );
                fetchAllFishes();
            }, 2000 );
        };

        window.addEventListener( 'userLogout', handleUserLogout );
        window.addEventListener( 'userLogin', handleUserLogin );

        return () => {
            if ( interval ) {
                clearInterval( interval );
            }
            window.removeEventListener( 'userLogout', handleUserLogout );
            window.removeEventListener( 'userLogin', handleUserLogin );
        };
    }, [] );

    // 로그인 상태 변화 감지 - 로그인 성공 시 즉시 새로고침
    useEffect( () => {
        if ( isAuthenticated && user && session ) {
            console.log( '🔄 로그인 성공 감지 - 즉시 물고기 데이터 새로고침' );
            console.log( '🔄 로그인 사용자:', user );
            console.log( '🔄 세션 정보:', session );

            // 로그인 성공 후 1초 대기 후 새로고침 (서버 세션 생성 완료 대기)
            setTimeout( () => {
                console.log( '🔄 로그인 후 지연 새로고침 실행' );
                fetchAllFishes();
            }, 1000 );
        } else if ( !isAuthenticated ) {
            console.log( '🔄 로그아웃 감지 - 물고기 데이터 초기화' );
            // 로그아웃 시 즉시 새로고침해서 해당 사용자 물고기 제거
            fetchAllFishes();
        }
    }, [ isAuthenticated, user?.id, session?.id ] );

    // 접속자를 물고기로 추가 (서버 연동)
    const addFish = async ( fishData ) => {
        try {
            // 서버에 어항 입장 요청 (이미 AuthContext에서 처리됨)
            // 여기서는 즉시 데이터 새로고침만 수행
            console.log( '🐠 물고기 추가 - 데이터 새로고침' );
            await fetchAllFishes();
        } catch ( error ) {
            console.error( '물고기 추가 실패:', error );
        }
    };

    // 물고기 제거 (서버 연동)
    const removeFish = async ( fishId ) => {
        try {
            // 서버에서 세션 삭제 (이미 AuthContext에서 처리됨)
            // 여기서는 즉시 데이터 새로고침만 수행
            console.log( '🐠 물고기 제거 - 데이터 새로고침' );
            await fetchAllFishes();
        } catch ( error ) {
            console.error( '물고기 제거 실패:', error );
        }
    };

    // 물고기 위치 업데이트 (서버 연동 일시 비활성화 - 테스트용)
    const updateFishPosition = async ( fishId, position ) => {
        try {
            // 로컬 상태 즉시 업데이트 (UX 향상)
            setFishes( prev =>
                prev.map( fish =>
                    fish.id === fishId
                        ? { ...fish, position }
                        : fish
                )
            );

            // 서버 연동 일시 비활성화 - 테스트용
            console.log( `🔧 테스트: 위치 업데이트 (서버 연동 비활성화) - fishId: ${ fishId }, position:`, position );

            // 서버에 위치 업데이트 요청 (주석 처리)
            // await aquariumService.updatePosition( position.x, position.y );
        } catch ( error ) {
            console.error( '위치 업데이트 실패:', error );
            // 실패 시 서버 데이터로 되돌리기 (주석 처리)
            // await fetchAllFishes();
        }
    };

    // 물고기 타입 업데이트
    const updateFishType = ( fishId, newType ) => {
        setFishes( prev =>
            prev.map( fish =>
                fish.id === fishId
                    ? { ...fish, type: newType }
                    : fish
            )
        );
    };

    // 물고기 메시지 추가
    const addFishMessage = ( fishId, message ) => {
        console.log( 'FishContext - 메시지 추가:', { fishId, message } );

        setFishMessages( prev => {
            const newMessages = {
                ...prev,
                [ fishId ]: {
                    message,
                    timestamp: Date.now()
                }
            };
            console.log( 'FishContext - 업데이트된 메시지:', newMessages );
            return newMessages;
        } );

        // 3초 후 메시지 자동 제거
        setTimeout( () => {
            console.log( 'FishContext - 메시지 제거:', fishId );
            setFishMessages( prev => {
                const newMessages = { ...prev };
                delete newMessages[ fishId ];
                return newMessages;
            } );
        }, 3000 );
    };

    // 로그아웃 애니메이션 시작
    const startLogoutAnimation = ( fishId ) => {
        const targetFish = fishes.find( fish => fish.id === fishId );
        if ( targetFish ) {
            setLogoutAnimation( {
                fishId,
                position: targetFish.position,
                fishType: targetFish.type
            } );

            // 2초 후 애니메이션 종료 및 물고기 제거
            setTimeout( () => {
                setLogoutAnimation( null );
                removeFish( fishId );
            }, 2000 );
        }
    };

    // 먹이주기 함수
    const feedFish = () => {
        setIsFeeding( true );
        console.log( '먹이주기 시작!' );

        // 3초 후 먹이주기 종료
        setTimeout( () => {
            setIsFeeding( false );
            console.log( '먹이주기 종료!' );
        }, 3000 );
    };

    const value = {
        fishes,
        tankSettings,
        fishMessages,
        isFeeding,
        isLoading,
        logoutAnimation,
        addFish,
        removeFish,
        updateFishPosition,
        updateFishType,
        addFishMessage,
        feedFish,
        startLogoutAnimation,
        setTankSettings,
        fetchAllFishes // 수동 새로고침용
    };

    return (
        <FishContext.Provider value={value}>
            {children}
        </FishContext.Provider>
    );
};