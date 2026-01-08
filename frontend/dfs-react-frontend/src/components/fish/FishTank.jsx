import React, { useEffect, useState, useCallback } from 'react';
import { useFish } from '../../contexts/FishContext';
import { useAuth } from '../../contexts/AuthContext';
import { getFishEmoji } from '../../utils/helpers';
import Fish from './Fish';
import OceanBackground from '../ui/OceanBackground';

const FishTank = () => {
    const { fishes, addFish, removeFish, updateFishPosition, addFishMessage, isFeeding, logoutAnimation } = useFish();
    const { user, isAuthenticated } = useAuth();
    const [ chatMessage, setChatMessage ] = useState( '' );
    const [ foodParticles, setFoodParticles ] = useState( [] ); // 먹이 파티클 상태

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

    // 채팅 전송 함수
    const handleSendMessage = ( e ) => {
        e.preventDefault();
        console.log( '채팅 전송 시도:', { chatMessage, isAuthenticated, user } );

        if ( !chatMessage.trim() || !isAuthenticated || !user ) {
            console.log( '채팅 전송 실패: 조건 불만족' );
            return;
        }

        // 현재 사용자의 물고기 찾기
        const userFish = fishes.find( fish => fish.userId === user.id );
        console.log( '사용자 물고기 찾기:', { userFish, fishes, userId: user.id } );
        console.log( '모든 물고기 ID들:', fishes.map( f => ( { id: f.id, userId: f.userId, name: f.name } ) ) );

        if ( userFish ) {
            console.log( '말풍선 추가 시도:', userFish.id, chatMessage.trim() );
            addFishMessage( userFish.id, chatMessage.trim() );
            setChatMessage( '' ); // 입력창 초기화

            // 강제로 테스트 메시지도 추가
            console.log( '테스트: fishMessages 직접 확인' );
        } else {
            console.log( '사용자 물고기를 찾을 수 없음' );
            // 디버깅을 위해 첫 번째 물고기에 메시지 추가
            if ( fishes.length > 0 ) {
                console.log( '테스트: 첫 번째 물고기에 메시지 추가', fishes[ 0 ].id );
                addFishMessage( fishes[ 0 ].id, chatMessage.trim() );
                setChatMessage( '' );
            }
        }
    };

    // 사용자가 로그인했을 때 물고기 추가 (한 번만 실행되도록 수정)
    useEffect( () => {
        if ( isAuthenticated && user && user.id ) {
            // 이미 해당 사용자의 물고기가 있는지 확인
            const existingFish = fishes.find( fish => fish.userId === user.id );
            if ( !existingFish ) {
                console.log( '로그인 감지, 물고기 추가 시도:', user );
                addFish( {
                    userId: user.id,
                    name: user.name || user.email,
                    type: user.fishType || 'goldfish'
                } );
            }
        }
    }, [ isAuthenticated, user?.id ] ); // addFish와 user 전체 객체 제거

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
                {fishes.length === 0 && (
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
                        placeholder={isAuthenticated ? "물고기에게 말을 걸어보세요... 💬" : "로그인 후 채팅 가능"}
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
                    {isAuthenticated ? `✅ ${ user?.name }님 로그인됨` : '❌ 로그인이 필요합니다'}
                </div>
            </div>
        </div>
    );
};

export default FishTank;