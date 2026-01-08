import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate( '/' );
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* 왼쪽: 로고 및 웰컴 메시지 */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-2xl font-bold flex items-center hover:text-blue-200 transition-colors">
                            🐠 Fish Tank
                        </Link>

                        <div className="hidden md:block text-blue-200 text-sm">
                            어항 속 물고기들의 세상에 오신 것을 환영합니다! 🌊
                        </div>
                    </div>

                    {/* 오른쪽: 로그인된 사용자 정보만 표시 */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
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