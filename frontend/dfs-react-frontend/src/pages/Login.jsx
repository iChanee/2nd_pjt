import React, { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const { dispatch } = useSession();
    const navigate = useNavigate();

    const handleSubmit = ( e ) => {
        e.preventDefault();
        // TODO: 백엔드 API 호출
        dispatch( { type: 'LOGIN', payload: { id: 1, name: '선장님', email } } );
        navigate( '/' );
    };

    return (
        <main className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white/90 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl border border-white/50 max-w-md w-full mx-auto">
                <h1 className="text-4xl font-black text-center text-gray-800 mb-8">⚓ 로그인</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={( e ) => setEmail( e.target.value )}
                            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={( e ) => setPassword( e.target.value )}
                            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-transparent text-lg"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        🌊 출항하기
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    계정이 없으신가요?{' '}
                    <a href="/register" className="text-blue-600 font-semibold hover:underline">회원가입</a>
                </p>
            </div>
        </main>
    );
};

export default Login;
