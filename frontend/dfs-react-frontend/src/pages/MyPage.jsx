import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFish } from '../contexts/FishContext';

const MyPage = () => {
    const { user, logout } = useAuth();
    const { fishes } = useFish();
    const [ selectedFishType, setSelectedFishType ] = useState( user?.fishType || 'goldfish' );

    const myFish = fishes.find( fish => fish.userId === user?.id );

    const fishTypes = [
        { value: 'goldfish', label: '금붕어', emoji: '🐠' },
        { value: 'tropical', label: '열대어', emoji: '🐟' },
        { value: 'shark', label: '상어', emoji: '🦈' },
        { value: 'whale', label: '고래', emoji: '🐋' },
        { value: 'octopus', label: '문어', emoji: '🐙' },
        { value: 'crab', label: '게', emoji: '🦀' }
    ];

    const handleFishTypeChange = ( newType ) => {
        setSelectedFishType( newType );
        // TODO: API 호출로 사용자 물고기 타입 업데이트
        console.log( '물고기 타입 변경:', newType );
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    🐠 마이페이지
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* 사용자 정보 */}
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">내 정보</h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">이름:</span> {user?.name || '익명'}</p>
                                <p><span className="font-medium">이메일:</span> {user?.email}</p>
                                <p><span className="font-medium">가입일:</span> {new Date( user?.joinedAt || Date.now() ).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* 물고기 설정 */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">내 물고기 설정</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        물고기 종류 선택
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {fishTypes.map( type => (
                                            <button
                                                key={type.value}
                                                onClick={() => handleFishTypeChange( type.value )}
                                                className={`p-3 rounded-lg border-2 transition-all ${ selectedFishType === type.value
                                                    ? 'border-blue-500 bg-blue-100'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{type.emoji}</div>
                                                <div className="text-xs">{type.label}</div>
                                            </button>
                                        ) )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 물고기 상태 */}
                    <div className="space-y-6">
                        {myFish ? (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">어항 속 내 물고기</h2>
                                <div className="text-center">
                                    <div className="text-6xl mb-4">
                                        {fishTypes.find( t => t.value === myFish.type )?.emoji || '🐠'}
                                    </div>
                                    <p className="text-lg font-medium">{myFish.name}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        위치: ({Math.round( myFish.position.x )}%, {Math.round( myFish.position.y )}%)
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        입장 시간: {new Date( myFish.joinedAt ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <div className="text-4xl mb-4">🌊</div>
                                <p className="text-gray-600">어항에 물고기가 없습니다.</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    홈페이지로 이동하면 자동으로 물고기가 생성됩니다.
                                </p>
                            </div>
                        )}

                        {/* 통계 */}
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">어항 통계</h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">현재 어항 물고기:</span> {fishes.length}마리</p>
                                <p><span className="font-medium">내 활동 시간:</span>
                                    {myFish ? Math.round( ( Date.now() - new Date( myFish.joinedAt ) ) / 60000 ) : 0}분
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 로그아웃 버튼 */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;