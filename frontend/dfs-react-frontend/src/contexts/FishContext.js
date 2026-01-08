import React, { createContext, useContext, useState } from 'react';

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

    // 접속자를 물고기로 추가 (중복 방지)
    const addFish = ( fishData ) => {
        // 이미 같은 userId를 가진 물고기가 있는지 확인
        setFishes( prev => {
            const existingFish = prev.find( fish => fish.userId === fishData.userId );

            if ( existingFish ) {
                console.log( '이미 존재하는 물고기:', existingFish );
                return prev; // 중복이면 기존 배열 반환
            }

            const newFish = {
                id: Date.now() + Math.random(), // 더 고유한 ID 생성
                name: fishData.name || '익명의 물고기',
                type: fishData.type || 'goldfish',
                position: {
                    x: Math.random() * 60 + 20, // 20-80% 범위 (더 중앙으로)
                    y: Math.random() * 40 + 30  // 30-70% 범위 (더 중앙으로)
                },
                joinedAt: new Date(),
                ...fishData
            };

            console.log( '새 물고기 추가:', newFish );
            return [ ...prev, newFish ];
        } );

        // 새로 추가된 물고기 반환 (비동기적이므로 정확하지 않을 수 있음)
        return null;
    };

    // 물고기 제거 (접속자 나감)
    const removeFish = ( fishId ) => {
        setFishes( prev => prev.filter( fish => fish.id !== fishId ) );
    };

    // 물고기 위치 업데이트
    const updateFishPosition = ( fishId, position ) => {
        setFishes( prev =>
            prev.map( fish =>
                fish.id === fishId
                    ? { ...fish, position }
                    : fish
            )
        );
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
        logoutAnimation,
        addFish,
        removeFish,
        updateFishPosition,
        updateFishType,
        addFishMessage,
        feedFish,
        startLogoutAnimation,
        setTankSettings
    };

    return (
        <FishContext.Provider value={value}>
            {children}
        </FishContext.Provider>
    );
};