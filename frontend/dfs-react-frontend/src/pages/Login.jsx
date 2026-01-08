import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
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
            // TODO: 실제 API 호출로 대체
            // 임시 로그인 로직
            if ( formData.email && formData.password ) {
                const userData = {
                    id: Date.now(),
                    email: formData.email,
                    name: formData.email.split( '@' )[ 0 ],
                    fishType: 'goldfish',
                    joinedAt: new Date().toISOString()
                };

                login( userData );
                navigate( '/' );
            } else {
                setError( '이메일과 비밀번호를 입력해주세요.' );
            }
        } catch ( err ) {
            setError( '로그인에 실패했습니다. 다시 시도해주세요.' );
        } finally {
            setIsLoading( false );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🐠</div>
                    <h1 className="text-2xl font-bold text-gray-800">Fish Tank 로그인</h1>
                    <p className="text-gray-600 mt-2">어항 속 물고기가 되어보세요!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        계정이 없으신가요?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            회원가입
                        </Link>
                    </p>
                </div>

                {/* 데모 계정 안내 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">🎯 데모 체험</p>
                    <p className="text-xs text-blue-700">
                        아무 이메일과 비밀번호를 입력하면 데모 계정으로 로그인됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;