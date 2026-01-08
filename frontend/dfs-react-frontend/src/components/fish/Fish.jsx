import React, { useState, useEffect, useRef } from 'react';
import { getFishEmoji, getFishInfo, calculateRandomMovement, getRandomMoveInterval } from '../../utils/helpers';
import { useFish } from '../../contexts/FishContext';

const Fish = ( { fish } ) => {
    // 물고기 정보 가져오기
    const fishInfo = getFishInfo( fish.type );

    // 완전히 독립적인 위치 관리
    const [ position, setPosition ] = useState( {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
    } );
    const [ direction, setDirection ] = useState( 1 );
    const [ isDragging, setIsDragging ] = useState( false );
    const [ dragOffset, setDragOffset ] = useState( { x: 0, y: 0 } );
    const fishRef = useRef( null );
    const { fishMessages } = useFish();

    const currentMessage = fishMessages[ fish.id ];

    // 크기 클래스 결정
    const getSizeClass = ( size ) => {
        switch ( size ) {
            case 'small': return 'text-3xl';      // 작은 물고기 (기존 text-lg → text-3xl)
            case 'medium': return 'text-4xl';     // 중간 물고기 (기존 text-2xl → text-4xl)
            case 'large': return 'text-5xl';      // 큰 물고기 (기존 text-3xl → text-5xl)
            case 'xlarge': return 'text-6xl';     // 매우 큰 물고기 (기존 text-4xl → text-6xl)
            default: return 'text-4xl';
        }
    };

    // 움직임 간격 계산 (speed에 반비례)
    const getMoveInterval = () => {
        const baseInterval = 2000; // 기본 2초
        return Math.max( 800, baseInterval / fishInfo.speed ); // 최소 0.8초
    };

    // 드래그 시작
    const handleMouseDown = ( e ) => {
        e.preventDefault();
        setIsDragging( true );

        const rect = fishRef.current.getBoundingClientRect();
        const containerRect = fishRef.current.parentElement.getBoundingClientRect();

        setDragOffset( {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        } );

        console.log( `Fish ${ fish.id } 드래그 시작` );
    };

    // 드래그 중
    const handleMouseMove = ( e ) => {
        if ( !isDragging ) return;

        e.preventDefault();
        const containerRect = fishRef.current.parentElement.getBoundingClientRect();

        const newX = ( ( e.clientX - dragOffset.x - containerRect.left ) / containerRect.width ) * 100;
        const newY = ( ( e.clientY - dragOffset.y - containerRect.top ) / containerRect.height ) * 100;

        const clampedPosition = {
            x: Math.max( 0, Math.min( 100, newX ) ),
            y: Math.max( 0, Math.min( 100, newY ) )
        };

        setPosition( clampedPosition );

        // 방향 결정
        if ( clampedPosition.x > position.x ) setDirection( 1 );
        else if ( clampedPosition.x < position.x ) setDirection( -1 );
    };

    // 드래그 종료
    const handleMouseUp = () => {
        if ( isDragging ) {
            setIsDragging( false );
            console.log( `Fish ${ fish.id } 드래그 종료: X: ${ position.x.toFixed( 1 ) }%, Y: ${ position.y.toFixed( 1 ) }%` );
        }
    };

    // 전역 마우스 이벤트 리스너
    useEffect( () => {
        if ( isDragging ) {
            document.addEventListener( 'mousemove', handleMouseMove );
            document.addEventListener( 'mouseup', handleMouseUp );

            return () => {
                document.removeEventListener( 'mousemove', handleMouseMove );
                document.removeEventListener( 'mouseup', handleMouseUp );
            };
        }
    }, [ isDragging, dragOffset, position ] );

    // 자동 움직임 (드래그 중이 아닐 때만)
    useEffect( () => {
        if ( isDragging ) return; // 드래그 중이면 자동 움직임 중지

        const moveInterval = setInterval( () => {
            setPosition( prev => {
                // 물고기 타입별 움직임 계산
                const movement = calculateRandomMovement( fish.type );

                const newPosition = {
                    x: Math.max( 5, Math.min( 95, prev.x + movement.x ) ),
                    y: Math.max( 5, Math.min( 95, prev.y + movement.y ) )
                };

                console.log( `Fish ${ fish.id } (${ fish.type }) 움직임: X ${ prev.x.toFixed( 1 ) } → ${ newPosition.x.toFixed( 1 ) }, Y ${ prev.y.toFixed( 1 ) } → ${ newPosition.y.toFixed( 1 ) }` );

                // 방향 결정
                if ( newPosition.x > prev.x ) setDirection( 1 );
                else if ( newPosition.x < prev.x ) setDirection( -1 );

                return newPosition;
            } );
        }, getMoveInterval() ); // 물고기 타입별 다른 간격

        return () => clearInterval( moveInterval );
    }, [ fish.id, fish.type, isDragging ] );

    return (
        <div
            ref={fishRef}
            className={`absolute cursor-pointer hover:scale-110 ${ isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab' }`}
            style={{
                left: `${ position.x }%`,
                top: `${ position.y * 4 }px`, // calc(100vh - 80px) 기준으로 조정
                zIndex: isDragging ? 1000 : 10,
                transition: isDragging ? 'none' : 'all 2.5s ease-in-out',
                userSelect: 'none',
            }}
            title={`${ fish.name } - X: ${ position.x.toFixed( 1 ) }%, Y: ${ position.y.toFixed( 1 ) }% (${ ( position.y * 5 ).toFixed( 0 ) }px)`}
            onMouseDown={handleMouseDown}
        >
            {/* 말풍선 */}
            {currentMessage && (
                <div
                    className={`absolute animate-bounce-in ${ position.y < 30 ? 'top-full mt-3' : 'bottom-full mb-3'
                        }`}
                    style={{
                        zIndex: 100,
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div
                        className="relative bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-2xl border border-gray-200 text-sm font-medium break-words"
                        style={{
                            minWidth: '80px',
                            maxWidth: '280px',
                            width: 'max-content',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal'
                        }}
                    >
                        {currentMessage.message}
                        <div
                            className={`absolute left-1/2 transform -translate-x-1/2 ${ position.y < 30
                                ? 'bottom-full'
                                : 'top-full'
                                }`}
                        >
                            <div
                                className={`w-0 h-0 ${ position.y < 30
                                    ? 'border-l-4 border-r-4 border-b-4 border-transparent border-b-white'
                                    : 'border-l-4 border-r-4 border-t-4 border-transparent border-t-white'
                                    }`}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* 물고기 이모지 */}
            <div
                className={`${ getSizeClass( fishInfo.size ) }`}
                style={{
                    transform: `scaleX(${ direction })`,
                    transformOrigin: 'center'
                }}
            >
                {getFishEmoji( fish.type )}
            </div>

            {/* 이름 */}
            <div className="text-xs text-white bg-black bg-opacity-50 rounded px-1 mt-1 text-center whitespace-nowrap">
                {fish.name}
            </div>
        </div>
    );
};

export default Fish;