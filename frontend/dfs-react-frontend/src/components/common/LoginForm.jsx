import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import OceanBackground from '../ui/OceanBackground';

const LoginForm = () => {
    const [ formData, setFormData ] = useState( {
        email: '',
        password: ''
    } );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ error, setError ] = useState( '' );

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = ( e ) => {
        setFormData( {
            ...formData,
            [ e.target.name ]: e.target.value
        } );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();
        setIsLoading( true );
        setError( '' );

        try {
            await login( formData );
            // Home에서 조건부 렌더링하므로 navigate 불필요
        } catch ( err ) {
            const errorMessage = err.message || '로그인에 실패했습니다. 다시 시도해주세요.';

            // 미가입 사용자인 경우 회원가입 안내
            if ( errorMessage.includes( '가입되지 않은 이메일' ) || errorMessage.includes( '회원가입' ) ) {
                const shouldRegister = window.confirm(
                    '가입되지 않은 이메일입니다.\n회원가입 페이지로 이동하시겠습니까?'
                );

                if ( shouldRegister ) {
                    navigate( '/register' );
                    return;
                }
            }

            setError( errorMessage );
        } finally {
            setIsLoading( false );
        }
    };

    return (
        <OceanBackground>
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-sm sm:max-w-md lg:max-w-lg w-full">
                    {/* 메인 타이틀 */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🐠 원양어선 🐠</h1>
                        <p className="text-blue-100 text-sm sm:text-base lg:text-lg px-2">
                            어항 속 물고기가 되어 다른 사용자들과 함께 헤엄쳐보세요!
                        </p>
                    </div>

                    {/* 로그인 폼 */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8">
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                                >
                                    {isLoading ? '로그인 중...' : '🐟 어항에 입장하기'}
                                </button>

                                <Link
                                    to="/register"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 sm:py-3 px-4 rounded-lg transition-colors block text-center text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                                >
                                    🐠 새 물고기로 회원가입
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* 하단 설명 */}
                    <div className="text-center mt-6 sm:mt-8 text-blue-100 text-xs sm:text-sm px-2">
                        <p>실시간으로 다른 사용자들과 함께 어항에서 헤엄치며</p>
                        <p>나만의 물고기로 소통해보세요! 🌊</p>
                    </div>
                </div>
            </div>
        </OceanBackground>
    );
};

export default LoginForm;