import React, { useState, useEffect } from 'react';
import { getFishEmoji, calculateRandomMovement, clampPosition, getRandomMoveInterval } from '../../utils/helpers';

const Fish = ( { fish, onPositionChange } ) => {
    const [ position, setPosition ] = useState( fish.position );
    const [ direction, setDirection ] = useState( 1 ); // 1: 오른쪽, -1: 왼쪽

    // 물고기 자동 움직임
    useEffect( () => {
        const moveInterval = setInterval( () => {
            setPosition( prev => {
                const movement = calculateRandomMovement( fish.type );
                const newPosition = {
                    x: prev.x + movement.x,
                    y: prev.y + movement.y
                };

                // 경계 체크 및 조정
                const clampedPosition = clampPosition( newPosition );

                // 방향 결정
                if ( clampedPosition.x > prev.x ) setDirection( 1 );
                else if ( clampedPosition.x < prev.x ) setDirection( -1 );

                // 부모 컴포넌트에 위치 변경 알림
                if ( onPositionChange ) {
                    onPositionChange( fish.id, clampedPosition );
                }

                return clampedPosition;
            } );
        }, getRandomMoveInterval() );

        return () => clearInterval( moveInterval );
    }, [ fish.id, fish.type, onPositionChange ] );

    return (
        <div
            className="absolute transition-all duration-1000 ease-in-out cursor-pointer hover:scale-110 fish-hover"
            style={{
                left: `${ position.x }%`,
                top: `${ position.y }%`,
                transform: `scaleX(${ direction })`,
                zIndex: 10
            }}
            title={`${ fish.name } (${ new Date( fish.joinedAt ).toLocaleTimeString() })`}
        >
            <div className="text-2xl animate-bounce">
                {getFishEmoji( fish.type )}
            </div>
            <div className="text-xs text-white bg-black bg-opacity-50 rounded px-1 mt-1 text-center whitespace-nowrap">
                {fish.name}
            </div>
        </div>
    );
};

export default Fish;