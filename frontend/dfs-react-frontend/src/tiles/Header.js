import React from 'react';
import { useSession } from '../contexts/SessionContext';

const Header = () => {
    const { state, dispatch } = useSession();

    const handleLogin = () => {
        dispatch( {
            type: 'LOGIN',
            payload: { id: 1, name: '사용자님', email: 'user@example.com' }
        } );
    };

    const handleLogout = () => {
        dispatch( { type: 'LOGOUT' } );
    };
    return (
        <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-row flex-nowrap items-center justify-between w-full">
                {/* 좌측: 제목들 (로그인 상태별 변경) */}
                <div className="flex flex-col space-y-2 flex-1 min-w-0">
                    {state.isLoggedIn ? (
                        <>
                            <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">
                                🐋 원양어선 대장 환영!
                            </h1>
                            <h3 className="text-2xl md:text-3xl font-bold text-blue-100 drop-shadow-md">
                                ⚓ {state.user?.name}님 출항 준비 완료!
                            </h3>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">
                                🐋 Welcome to 원양어선
                            </h1>
                            <h3 className="text-2xl md:text-3xl font-bold text-blue-100 drop-shadow-md">
                                👹 들어올 땐 마음대로라도 나가는 건 아니란다
                            </h3>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">
                    {state.isLoggedIn ? (
                        <>
                            <span className="text-xl font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                안녕하세요, {state.user?.name}님!
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500/90 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                🚪 로그아웃
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="bg-emerald-500/90 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-xl"
                        >
                            ⚡ 로그인
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header;
