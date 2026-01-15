import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFishTypeOptions, getSpeedText, getSizeText } from '../utils/constants';

const Register = () => {
    const [ formData, setFormData ] = useState( {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        fishType: 'goldfish'
    } );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ error, setError ] = useState( '' );
    const [ fishTypeOptions, setFishTypeOptions ] = useState( [] );

    const { register } = useAuth();
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 물고기 타입 로드
    useEffect( () => {
        const options = getFishTypeOptions();
        setFishTypeOptions( options );
    }, [] );

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

        // 유효성 검사
        if ( formData.password !== formData.confirmPassword ) {
            setError( '비밀번호가 일치하지 않습니다.' );
            setIsLoading( false );
            return;
        }

        if ( formData.password.length < 6 ) {
            setError( '비밀번호는 6자 이상이어야 합니다.' );
            setIsLoading( false );
            return;
        }

        try {
            const registerData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                fishType: formData.fishType
            };

            await register( registerData );
            navigate( '/' );
        } catch ( err ) {
            setError( err.message || '회원가입에 실패했습니다. 다시 시도해주세요.' );
        } finally {
            setIsLoading( false );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-600 flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🐟</div>
                    <h1 className="text-2xl font-bold text-gray-800">Fish Tank 회원가입</h1>
                    <p className="text-gray-600 mt-2">나만의 물고기로 어항에 참여하세요!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            이름
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="홍길동"
                        />
                    </div>

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
                            placeholder="6자 이상 입력하세요"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            비밀번호 확인
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            내 물고기 선택
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {fishTypeOptions.map( type => (
                                <label key={type.value} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="fishType"
                                        value={type.value}
                                        checked={formData.fishType === type.value}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className={`p-3 rounded-lg border-2 text-center transition-all ${ formData.fishType === type.value
                                        ? 'border-blue-500 bg-blue-100'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <div className="text-2xl mb-1">{type.emoji}</div>
                                        <div className="text-xs font-medium mb-1">{type.label}</div>
                                        <div className="text-xs text-gray-500">
                                            <div>속도: {getSpeedText( type.speed )}</div>
                                            <div>크기: {getSizeText( type.size )}</div>
                                        </div>
                                    </div>
                                </label>
                            ) )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        {isLoading ? '가입 중...' : '회원가입'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;