import React, { useState, useEffect, useRef } from 'react';
import { getFishEmoji, getFishInfo, calculateRandomMovement, getRandomMoveInterval } from '../../utils/helpers';
import { useFish } from '../../contexts/FishContext';

const Fish = ( { fish } ) => {
    // 물고기 정보 가져오기
    const fishInfo = getFishInfo( fish.type );

    // 완전히 독립적인 위치 관리 (px 기반)
    const [ position, setPosition ] = useState( {
        x: Math.random() * 90 + 5, // % 기반 (X축) - 범위 확장: 5% ~ 95%
        y: Math.random() * 600 + 80 // px 기반 (Y축) - 범위 확장: 80px ~ 680px
    } );
    const [ direction, setDirection ] = useState( 1 );
    const [ isDragging, setIsDragging ] = useState( false );
    const [ dragOffset, setDragOffset ] = useState( { x: 0, y: 0 } );
    const fishRef = useRef( null );
    const { fishMessages } = useFish();

    // 물고기별 고유한 성격 특성 (컴포넌트 생성 시 한 번만 설정)
    const [ fishPersonality ] = useState( () => ( {
        aggressiveness: Math.random(), // 0-1: 움직임의 활발함
        verticalPreference: Math.random() - 0.5, // -0.5~0.5: 위아래 선호도
        horizontalPreference: Math.random() - 0.5, // -0.5~0.5: 좌우 선호도
        restProbability: Math.random() * 0.3 // 0-0.3: 가만히 있을 확률
    } ) );

    const currentMessage = fishMessages[ fish.id ];

    // 크기 클래스 결정 - 반응형 개선
    const getSizeClass = ( size ) => {
        switch ( size ) {
            case 'small': return 'text-xl sm:text-2xl lg:text-3xl';      // 작은 물고기
            case 'medium': return 'text-2xl sm:text-3xl lg:text-4xl';    // 중간 물고기
            case 'large': return 'text-3xl sm:text-4xl lg:text-5xl';     // 큰 물고기
            case 'xlarge': return 'text-4xl sm:text-5xl lg:text-6xl';    // 매우 큰 물고기
            default: return 'text-2xl sm:text-3xl lg:text-4xl';
        }
    };

    // 움직임 간격 계산 (물고기별 개별 간격)
    const getMoveInterval = () => {
        const baseInterval = 2000; // 기본 2초
        const speedMultiplier = fishInfo.speed || 1;
        const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 ~ 1.3 배수

        const interval = Math.max( 800, ( baseInterval / speedMultiplier ) * randomFactor );
        return interval;
    };

    // 드래그 시작 - 터치 이벤트 지원 추가
    const handleMouseDown = ( e ) => {
        e.preventDefault();
        setIsDragging( true );

        const rect = fishRef.current.getBoundingClientRect();

        // 마우스와 터치 이벤트 모두 지원
        const clientX = e.touches ? e.touches[ 0 ].clientX : e.clientX;
        const clientY = e.touches ? e.touches[ 0 ].clientY : e.clientY;

        setDragOffset( {
            x: clientX - rect.left,
            y: clientY - rect.top
        } );
    };

    // 드래그 중 - 터치 이벤트 지원 추가
    const handleMouseMove = ( e ) => {
        if ( !isDragging ) return;

        e.preventDefault();
        const containerRect = fishRef.current.parentElement.getBoundingClientRect();

        // 마우스와 터치 이벤트 모두 지원
        const clientX = e.touches ? e.touches[ 0 ].clientX : e.clientX;
        const clientY = e.touches ? e.touches[ 0 ].clientY : e.clientY;

        const newX = ( ( clientX - dragOffset.x - containerRect.left ) / containerRect.width ) * 100;
        const newY = ( ( clientY - dragOffset.y - containerRect.top ) / containerRect.height ) * 100;

        const clampedPosition = {
            x: Math.max( 0, Math.min( 100, newX ) ), // 드래그 시에는 전체 화면 사용 가능
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
        }
    };

    // 전역 마우스/터치 이벤트 리스너
    useEffect( () => {
        if ( isDragging ) {
            // 마우스 이벤트
            document.addEventListener( 'mousemove', handleMouseMove );
            document.addEventListener( 'mouseup', handleMouseUp );

            // 터치 이벤트
            document.addEventListener( 'touchmove', handleMouseMove, { passive: false } );
            document.addEventListener( 'touchend', handleMouseUp );

            return () => {
                document.removeEventListener( 'mousemove', handleMouseMove );
                document.removeEventListener( 'mouseup', handleMouseUp );
                document.removeEventListener( 'touchmove', handleMouseMove );
                document.removeEventListener( 'touchend', handleMouseUp );
            };
        }
    }, [ isDragging, dragOffset, position ] );

    // 자동 움직임 (드래그 중이 아닐 때만)
    useEffect( () => {
        if ( isDragging ) return; // 드래그 중이면 자동 움직임 중지

        const moveInterval = setInterval( () => {
            setPosition( prev => {
                // 가끔 쉬기 (성격에 따라)
                if ( Math.random() < fishPersonality.restProbability ) {
                    return prev; // 움직이지 않음
                }

                // 물고기 타입별 움직임 계산
                const movement = calculateRandomMovement( fish.type );

                // 성격 특성 적용
                const personalizedMovement = {
                    x: movement.x * ( 1 + fishPersonality.aggressiveness * 0.5 ) + fishPersonality.horizontalPreference * 2,
                    y: movement.y * ( 1 + fishPersonality.aggressiveness * 0.5 ) + fishPersonality.verticalPreference * 3
                };

                const newPosition = {
                    x: Math.max( 2, Math.min( 98, prev.x + personalizedMovement.x ) ), // % 기반 (X축) - 범위 확장: 2% ~ 98%
                    y: Math.max( 80, Math.min( 680, prev.y + personalizedMovement.y * 20 ) ) // px 기반 (Y축) - 범위 확장
                };

                // 방향 결정
                if ( newPosition.x > prev.x ) setDirection( 1 );
                else if ( newPosition.x < prev.x ) setDirection( -1 );

                return newPosition;
            } );
        }, getMoveInterval() ); // 물고기별 개별 간격

        return () => clearInterval( moveInterval );
    }, [ fish.id, fish.type, isDragging ] );

    return (
        <div
            ref={fishRef}
            className={`absolute cursor-pointer hover:scale-110 ${ isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab' } touch-none`}
            style={{
                left: `${ position.x }%`,
                top: `${ position.y }px`, // px 기반으로 변경
                zIndex: isDragging ? 1000 : 10,
                transition: isDragging ? 'none' : 'all 2.5s ease-in-out',
                userSelect: 'none',
            }}
            title={`${ fish.name } - X: ${ position.x.toFixed( 1 ) }%, Y: ${ position.y.toFixed( 0 ) }px`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* 말풍선 - 반응형 개선 */}
            {currentMessage && (
                <div
                    className={`absolute animate-bounce-in ${ position.y < 30 ? 'top-full mt-2 sm:mt-3' : 'bottom-full mb-2 sm:mb-3'
                        }`}
                    style={{
                        zIndex: 100,
                        left: '50%',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div
                        className="relative bg-white text-gray-800 px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 text-xs sm:text-sm font-medium break-words"
                        style={{
                            minWidth: '60px',
                            maxWidth: window.innerWidth < 640 ? '200px' : '280px', // 모바일에서 더 작게
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
                                    ? 'border-l-2 border-r-2 border-b-2 sm:border-l-4 sm:border-r-4 sm:border-b-4 border-transparent border-b-white'
                                    : 'border-l-2 border-r-2 border-t-2 sm:border-l-4 sm:border-r-4 sm:border-t-4 border-transparent border-t-white'
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

            {/* 이름 - 반응형 개선 */}
            <div className="text-xs sm:text-xs text-white bg-black bg-opacity-50 rounded px-1 mt-1 text-center whitespace-nowrap max-w-[80px] sm:max-w-none overflow-hidden text-ellipsis">
                {fish.name}
            </div>
        </div>
    );
};

export default Fish;