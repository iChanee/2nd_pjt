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

    // 접속자를 물고기로 추가
    const addFish = ( fishData ) => {
        const newFish = {
            id: Date.now(),
            name: fishData.name || '익명의 물고기',
            type: fishData.type || 'goldfish',
            position: {
                x: Math.random() * 80 + 10, // 10-90% 범위
                y: Math.random() * 60 + 20  // 20-80% 범위
            },
            joinedAt: new Date(),
            ...fishData
        };
        setFishes( prev => [ ...prev, newFish ] );
        return newFish;
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

    const value = {
        fishes,
        tankSettings,
        addFish,
        removeFish,
        updateFishPosition,
        setTankSettings
    };

    return (
        <FishContext.Provider value={value}>
            {children}
        </FishContext.Provider>
    );
};