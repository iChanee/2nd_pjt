import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFish } from '../../contexts/FishContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { fishes, feedFish, startLogoutAnimation } = useFish();
    const navigate = useNavigate();

    const handleLogout = () => {
        // 현재 사용자의 물고기 찾기
        const userFish = fishes.find( fish => fish.userId === user?.id );

        console.log( '로그아웃 시도:', {
            userId: user?.id,
            userFish,
            allFishes: fishes.map( f => ( { id: f.id, userId: f.userId, type: f.type, name: f.name } ) )
        } );

        if ( userFish ) {
            console.log( '사용자 물고기 발견, 애니메이션 시작:', userFish );
            // 로그아웃 애니메이션 시작
            startLogoutAnimation( userFish.id );

            // 애니메이션이 끝난 후 실제 로그아웃 처리
            setTimeout( () => {
                logout();
                navigate( '/' );
            }, 2000 );
        } else {
            console.log( '사용자 물고기를 찾을 수 없음, 바로 로그아웃' );
            // 물고기가 없으면 바로 로그아웃
            logout();
            navigate( '/' );
        }
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* 왼쪽: 로고 및 웰컴 메시지 */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            {/* Fish Tank 정보 아이콘 (hover 시 정보 표시) */}
                            {isAuthenticated && (
                                <div className="relative group">
                                    <div className="cursor-pointer text-blue-200 hover:text-white transition-colors">
                                        🐠
                                    </div>

                                    {/* Hover 시 나타나는 정보 패널 */}
                                    <div className="absolute top-full left-0 mt-2 bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50 min-w-64">
                                        <h3 className="text-lg font-bold mb-2 flex items-center">
                                            🐠 Fish Tank 정보
                                        </h3>
                                        <p className="text-sm mb-2">현재 물고기: <span className="font-bold text-blue-300">{fishes.length}마리</span></p>
                                        <p className="text-xs text-gray-300 mb-3">
                                            실시간으로 접속자들이 물고기가 되어 헤엄치고 있어요!
                                        </p>

                                        {/* 물고기 목록 */}
                                        <div className="text-xs text-yellow-300">
                                            <div className="font-semibold mb-1">🐟 현재 접속 중:</div>
                                            {fishes.length > 0 ? (
                                                fishes.map( fish => (
                                                    <div key={fish.id} className="flex items-center space-x-1 mb-1">
                                                        <span>{fish.name}</span>
                                                        <span className="text-gray-400">({fish.type})</span>
                                                    </div>
                                                ) )
                                            ) : (
                                                <div className="text-gray-400">접속 중인 물고기가 없습니다</div>
                                            )}
                                        </div>

                                        {/* 개발용 정리 버튼 */}
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem( 'user' );
                                                localStorage.removeItem( 'authToken' );
                                                window.location.reload();
                                            }}
                                            className="mt-3 px-2 py-1 bg-red-600 hover:bg-red-700 text-xs rounded transition-colors w-full"
                                        >
                                            🧹 로컬스토리지 정리
                                        </button>
                                    </div>
                                </div>
                            )}
                            <Link to="/" className="text-2xl font-bold flex items-center hover:text-blue-200 transition-colors">
                                Fish Tank
                            </Link>


                        </div>

                        <div className="hidden md:block text-blue-200 text-sm">
                            어항 속 물고기들의 세상에 오신 것을 환영합니다! 🌊
                        </div>
                    </div>

                    {/* 오른쪽: 로그인된 사용자 정보만 표시 */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={feedFish}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1"
                                    title="물고기들에게 먹이주기"
                                >
                                    <span>🍤</span>
                                    <span>먹이주기</span>
                                </button>
                                <nav className="hidden md:flex items-center space-x-4 mr-4">
                                    <Link
                                        to="/"
                                        className="hover:text-blue-200 transition-colors font-medium"
                                    >
                                        어항
                                    </Link>
                                    <Link
                                        to="/mypage"
                                        className="hover:text-blue-200 transition-colors font-medium"
                                    >
                                        마이페이지
                                    </Link>
                                </nav>

                                <div className="flex items-center space-x-3">
                                    <span className="text-blue-200 text-sm">
                                        안녕하세요, <span className="font-medium text-white">{user?.name || user?.email}</span>님! 🐟
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors font-medium text-sm"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // 로그인 안 된 경우 아무것도 표시하지 않음
                            <div></div>
                        )}
                    </div>
                </div>

                {/* 모바일 네비게이션 (로그인된 경우만) */}
                {isAuthenticated && (
                    <div className="md:hidden mt-3 pt-3 border-t border-blue-500">
                        <nav className="flex space-x-4">
                            <Link
                                to="/"
                                className="hover:text-blue-200 transition-colors text-sm"
                            >
                                어항
                            </Link>
                            <Link
                                to="/mypage"
                                className="hover:text-blue-200 transition-colors text-sm"
                            >
                                마이페이지
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;