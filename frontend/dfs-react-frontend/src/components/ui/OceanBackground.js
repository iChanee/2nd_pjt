import React from 'react';

const OceanBackground = ( { children } ) => {
  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-800 overflow-hidden">
      {/* 물결 효과 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-blue-900/40"></div>

        {/* 애니메이션 물결 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-wave"></div>
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-wave opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/3 to-transparent animate-wave opacity-30" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* 해초 */}
        <div className="absolute bottom-0 left-10 w-4 h-32 bg-green-600 rounded-t-full opacity-70 animate-sway"></div>
        <div className="absolute bottom-0 left-20 w-3 h-24 bg-green-500 rounded-t-full opacity-60 animate-sway-reverse"></div>
        <div className="absolute bottom-0 right-16 w-5 h-40 bg-green-700 rounded-t-full opacity-50 animate-sway"></div>
        <div className="absolute bottom-0 right-32 w-3 h-28 bg-green-600 rounded-t-full opacity-70 animate-sway-reverse"></div>

        {/* 바닥 모래 */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-yellow-600 to-yellow-400 opacity-60"></div>
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OceanBackground;