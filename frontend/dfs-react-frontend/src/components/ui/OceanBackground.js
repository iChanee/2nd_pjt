import React from 'react';

const OceanBackground = ( { children } ) => {
  return (
    <div
      className="relative w-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-800"
      style={{
        height: '100vh', // 전체 화면 높이 사용
        minHeight: '100vh',
        marginTop: '-60px', // nav 높이만큼 위로 올림
        paddingTop: '60px', // 내용은 nav 아래부터 시작
        overflow: 'hidden'
      }}
    >
      {/* 물결 효과 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-blue-900/40"></div>

        {/* 애니메이션 물결 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-wave"></div>
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-wave opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/3 to-transparent animate-wave opacity-30" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* 해초 - 더 진하고 크게 */}
        <div className="absolute bottom-0 left-10 w-6 h-40 bg-green-700 rounded-t-full opacity-90 animate-sway shadow-lg"></div>
        <div className="absolute bottom-0 left-20 w-4 h-32 bg-green-600 rounded-t-full opacity-85 animate-sway-reverse shadow-md"></div>
        <div className="absolute bottom-0 left-32 w-5 h-36 bg-green-800 rounded-t-full opacity-80 animate-sway shadow-lg"></div>
        <div className="absolute bottom-0 right-16 w-7 h-48 bg-green-700 rounded-t-full opacity-85 animate-sway shadow-lg"></div>
        <div className="absolute bottom-0 right-32 w-4 h-35 bg-green-600 rounded-t-full opacity-90 animate-sway-reverse shadow-md"></div>
        <div className="absolute bottom-0 right-48 w-5 h-42 bg-green-800 rounded-t-full opacity-80 animate-sway shadow-lg"></div>

        {/* 추가 해초들 */}
        <div className="absolute bottom-0 left-1/4 w-4 h-28 bg-green-600 rounded-t-full opacity-75 animate-sway shadow-md"></div>
        <div className="absolute bottom-0 left-1/3 w-6 h-38 bg-green-700 rounded-t-full opacity-85 animate-sway-reverse shadow-lg"></div>
        <div className="absolute bottom-0 right-1/4 w-5 h-33 bg-green-800 rounded-t-full opacity-80 animate-sway shadow-md"></div>

        {/* 바닥 모래 - 더 진하고 두껍게 */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-yellow-700 via-yellow-600 to-yellow-500 opacity-85 shadow-inner"></div>

        {/* 모래 텍스처 효과 */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-amber-800 via-amber-700 to-transparent opacity-60"></div>

        {/* 모래 위 작은 돌들 */}
        <div className="absolute bottom-2 left-16 w-3 h-2 bg-gray-600 rounded-full opacity-70"></div>
        <div className="absolute bottom-3 left-32 w-2 h-2 bg-gray-700 rounded-full opacity-60"></div>
        <div className="absolute bottom-2 right-24 w-4 h-2 bg-gray-600 rounded-full opacity-75"></div>
        <div className="absolute bottom-4 right-48 w-2 h-1 bg-gray-800 rounded-full opacity-65"></div>
        <div className="absolute bottom-2 left-1/2 w-3 h-2 bg-gray-600 rounded-full opacity-70"></div>
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OceanBackground;