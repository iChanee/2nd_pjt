import React, { useEffect, useState, useCallback } from 'react';
import { useFish } from '../../contexts/FishContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { getFishEmoji } from '../../utils/helpers';
import Fish from './Fish';
import OceanBackground from '../ui/OceanBackground';

const FishTank = () => {
    const { fishes, addFish, removeFish, updateFishPosition, addFishMessage, isFeeding, isLoading, logoutAnimation } = useFish();
    const { user, isAuthenticated } = useAuth();
    const { messages, sendMessage } = useChat();
    const [ chatMessage, setChatMessage ] = useState( '' );
    const [ foodParticles, setFoodParticles ] = useState( [] ); // 먹이 파티클 상태
    const [ processedMessageIds, setProcessedMessageIds ] = useState( new Set() ); // 처리된 메시지 ID 추적

    // 채팅 메시지를 물고기 말풍선으로 표시 (중복 처리 방지)
    useEffect( () => {
        if ( messages.length > 0 ) {
            const latestMessage = messages[ messages.length - 1 ];

            // 이미 처리된 메시지인지 확인
            if ( processedMessageIds.has( latestMessage.id ) ) {
                return;
            }

            console.log( '� 새 채팅 메시지 감지:', latestMessage );
            console.log( '💬 현재 물고기 목록:', fishes.map( f => ( { id: f.id, userId: f.userId, name: f.name } ) ) );

            // 해당 사용자의 물고기 찾기
            const senderFish = fishes.find( fish => fish.userId === latestMessage.userId );
            if ( senderFish ) {
                console.log( '🐠 메시지 발신자 물고기 찾음:', senderFish );
                // 물고기 말풍선에 메시지 표시
                addFishMessage( senderFish.id, latestMessage.message );

                // 처리된 메시지 ID 추가
                setProcessedMessageIds( prev => new Set( prev ).add( latestMessage.id ) );
            } else {
                console.log( '❌ 메시지 발신자 물고기를 찾을 수 없음:', {
                    senderId: latestMessage.userId,
                    senderName: latestMessage.userName,
                    availableFishes: fishes.map( f => ( { id: f.id, userId: f.userId, name: f.name } ) )
                } );

                // 물고기 데이터를 다시 가져와서 매칭 재시도
                console.log( '🔄 물고기 데이터 새로고침 후 재시도' );
                setTimeout( () => {
                    const retryFish = fishes.find( fish => fish.userId === latestMessage.userId );
                    if ( retryFish ) {
                        console.log( '🐠 재시도로 물고기 찾음:', retryFish );
                        addFishMessage( retryFish.id, latestMessage.message );

                        // 처리된 메시지 ID 추가
                        setProcessedMessageIds( prev => new Set( prev ).add( latestMessage.id ) );
                    }
                }, 1000 );
            }
        }
    }, [ messages, fishes, addFishMessage ] );

    // 물고기 데이터 디버깅
    useEffect( () => {
        // console.log( '🐠 FishTank - 물고기 데이터 변경:', {
        //     fishCount: fishes.length,
        //     fishes: fishes,
        //     isLoading: isLoading,
        //     isAuthenticated: isAuthenticated,
        //     user: user
        // } );
    }, [ fishes, isLoading, isAuthenticated, user ] );

    // 먹이주기 이펙트
    useEffect( () => {
        if ( isFeeding ) {
            // 먹이 색상 배열
            const foodColors = [
                { bg: 'bg-yellow-400', emoji: '🟡' },
                { bg: 'bg-red-400', emoji: '🔴' },
                { bg: 'bg-green-400', emoji: '🟢' },
                { bg: 'bg-blue-400', emoji: '🔵' },
                { bg: 'bg-purple-400', emoji: '🟣' },
                { bg: 'bg-orange-400', emoji: '🟠' },
                { bg: 'bg-pink-400', emoji: '🩷' },
                { bg: 'bg-indigo-400', emoji: '🟦' },
                { bg: 'bg-teal-400', emoji: '🟩' },
                { bg: 'bg-amber-400', emoji: '🟨' }
            ];

            // 먹이 파티클 생성
            const particles = [];
            for ( let i = 0; i < 20; i++ ) {
                const randomColor = foodColors[ Math.floor( Math.random() * foodColors.length ) ];
                particles.push( {
                    id: i,
                    x: Math.random() * 100, // 0-100% 범위
                    y: -10, // 화면 위에서 시작
                    delay: Math.random() * 1000, // 0-1초 지연
                    color: randomColor
                } );
            }
            setFoodParticles( particles );

            // 3초 후 파티클 제거
            setTimeout( () => {
                setFoodParticles( [] );
            }, 3000 );
        }
    }, [ isFeeding ] );

    // 채팅 전송 함수 (물고기 말풍선으로 표시)
    const handleSendMessage = async ( e ) => {
        e.preventDefault();
        console.log( '채팅 전송 시도:', { chatMessage, isAuthenticated, user } );

        if ( !chatMessage.trim() || !isAuthenticated || !user ) {
            console.log( '채팅 전송 실패: 조건 불만족' );
            return;
        }

        try {
            // 공유 채팅 시스템으로 메시지 전송
            await sendMessage( chatMessage.trim() );
            setChatMessage( '' ); // 입력창 초기화
            console.log( '✅ 채팅 메시지 전송 성공 - 물고기 말풍선으로 표시됨' );
        } catch ( error ) {
            console.error( '❌ 채팅 전송 실패:', error );
            alert( '메시지 전송에 실패했습니다: ' + error.message );
        }
    };

    // 사용자가 로그인했을 때는 AuthContext에서 자동으로 어항 입장 처리
    // FishContext에서 주기적으로 서버 데이터를 가져오므로 별도 처리 불필요
    useEffect( () => {
        // 로그인 상태 변경 시 즉시 데이터 새로고침
        if ( isAuthenticated && user ) {
            // fetchAllFishes는 FishContext에서 자동으로 처리됨
            console.log( '로그인 감지, 서버 데이터 새로고침 예정' );
        }
    }, [ isAuthenticated, user?.id ] );

    // 로그아웃 시 물고기 제거 (단순화)
    useEffect( () => {
        return () => {
            // cleanup 함수는 컴포넌트 언마운트 시에만 실행
        };
    }, [] );

    const handleFishPositionChange = useCallback( ( fishId, newPosition ) => {
        updateFishPosition( fishId, newPosition );
    }, [ updateFishPosition ] );

    return (
        <div
            className="relative w-full"
            style={{
                height: '100vh', // 전체 화면 높이 사용
                minHeight: '100vh',
                marginTop: '-60px', // nav 높이만큼 위로 올림
                paddingTop: '60px', // 내용은 nav 아래부터 시작
                overflow: 'hidden'
            }}
        >
            <OceanBackground>
                {/* 물고기들 렌더링 */}
                {fishes
                    .filter( fish => !logoutAnimation || fish.id !== logoutAnimation.fishId ) // 로그아웃 애니메이션 중인 물고기는 제외
                    .map( fish => (
                        <Fish
                            key={fish.id}
                            fish={fish}
                        // onPositionChange={handleFishPositionChange} // 일시적으로 비활성화
                        />
                    ) )}

                {/* 먹이 파티클 렌더링 */}
                {foodParticles.map( particle => (
                    <div
                        key={particle.id}
                        className={`absolute w-3 h-3 ${ particle.color.bg } rounded-full shadow-lg`}
                        style={{
                            left: `${ particle.x }%`,
                            top: `${ particle.y }px`,
                            animation: `fall 3s ease-in ${ particle.delay }ms forwards`,
                            zIndex: 15
                        }}
                    >
                        <span className="text-xs">{particle.color.emoji}</span>
                    </div>
                ) )}

                {/* 로그아웃 애니메이션 */}
                {logoutAnimation && (
                    <div
                        className="absolute z-50"
                        style={{
                            left: `${ logoutAnimation.position.x }%`,
                            top: `${ logoutAnimation.position.y * 4 }px`
                        }}
                    >
                        {/* 새 애니메이션 */}
                        <div
                            className="absolute text-8xl"
                            style={{
                                animation: 'bird-catch 2s ease-in-out forwards',
                                zIndex: 60
                            }}
                        >
                            🦅
                        </div>

                        {/* 물고기 잡히는 애니메이션 */}
                        <div
                            className="absolute text-7xl"
                            style={{
                                animation: 'fish-caught 2s ease-in-out forwards',
                                zIndex: 55
                            }}
                        >
                            {getFishEmoji( logoutAnimation.fishType )}
                        </div>
                    </div>
                )}

                {/* 물고기가 없을 때 메시지 */}
                {fishes.length === 0 && !isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
                            <div className="text-4xl mb-4">🌊</div>
                            <h3 className="text-xl font-bold mb-2">텅 빈 어항</h3>
                            <p className="text-gray-300">
                                로그인하여 물고기가 되어 어항에 참여해보세요!
                            </p>
                        </div>
                    </div>
                )}

                {/* 로딩 상태 */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
                            <div className="text-4xl mb-4 animate-spin">🐠</div>
                            <h3 className="text-xl font-bold mb-2">어항 로딩 중...</h3>
                            <p className="text-gray-300">
                                물고기들을 불러오고 있습니다
                            </p>
                        </div>
                    </div>
                )}

                {/* 물거품 효과 */}
                <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none">
                    {[ ...Array( 5 ) ].map( ( _, i ) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white bg-opacity-30 rounded-full animate-ping"
                            style={{
                                left: `${ 20 + i * 15 }%`,
                                bottom: '10px',
                                animationDelay: `${ i * 0.5 }s`,
                                animationDuration: '3s'
                            }}
                        />
                    ) )}
                </div>
            </OceanBackground>

            {/* 채팅 입력창 - 항상 표시 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4" style={{ zIndex: 1000 }}>
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={( e ) => setChatMessage( e.target.value )}
                        placeholder={isAuthenticated ? "물고기 말풍선으로 채팅해보세요... 💬" : "로그인 후 채팅 가능"}
                        disabled={!isAuthenticated}
                        className="flex-1 px-4 py-3 bg-white border-2 border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed shadow-lg text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!chatMessage.trim() || !isAuthenticated}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition-colors font-medium shadow-lg"
                    >
                        💬
                    </button>
                </form>

                {/* 상태 표시 */}
                <div className="text-xs text-center mt-2 bg-black bg-opacity-70 text-white rounded px-2 py-1">
                    {isAuthenticated ? (
                        <span>✅ {user?.name}님 로그인됨 | 🐠 {fishes.length}마리 헤엄치는 중</span>
                    ) : (
                        <span>❌ 로그인이 필요합니다</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FishTank;