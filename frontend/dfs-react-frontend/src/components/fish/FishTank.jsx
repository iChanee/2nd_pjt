import React, { useEffect } from 'react';
import { useFish } from '../../contexts/FishContext';
import { useAuth } from '../../contexts/AuthContext';
import Fish from './Fish';
import OceanBackground from '../ui/OceanBackground';

const FishTank = () => {
    const { fishes, addFish, updateFishPosition } = useFish();
    const { user, isAuthenticated } = useAuth();

    // 사용자가 로그인했을 때 물고기 추가
    useEffect( () => {
        if ( isAuthenticated && user ) {
            // 이미 해당 사용자의 물고기가 있는지 확인
            const existingFish = fishes.find( fish => fish.userId === user.id );

            if ( !existingFish ) {
                addFish( {
                    userId: user.id,
                    name: user.name || user.email,
                    type: user.fishType || 'goldfish'
                } );
            }
        }
    }, [ isAuthenticated, user, fishes, addFish ] );

    const handleFishPositionChange = ( fishId, newPosition ) => {
        updateFishPosition( fishId, newPosition );
    };

    return (
        <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-lg">
            <OceanBackground>
                {/* 어항 정보 */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg z-20">
                    <h3 className="text-lg font-bold mb-2">🐠 Fish Tank</h3>
                    <p className="text-sm">현재 물고기: {fishes.length}마리</p>
                    <p className="text-xs text-gray-300 mt-1">
                        실시간으로 접속자들이 물고기가 되어 헤엄치고 있어요!
                    </p>
                </div>

                {/* 물고기들 렌더링 */}
                {fishes.map( fish => (
                    <Fish
                        key={fish.id}
                        fish={fish}
                        onPositionChange={handleFishPositionChange}
                    />
                ) )}

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
        </div>
    );
};

export default FishTank;