import React from 'react';

const Home = () => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* 플래시 예시 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 hover:scale-105 transition-all duration-500">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">🚢 출항 플래시</h2>
                        <p className="text-gray-600 leading-relaxed">최신 어부 출항 소식과 날씨 정보</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 hover:scale-105 transition-all duration-500">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">🐟 어획량</h2>
                        <p className="text-gray-600 leading-relaxed">실시간 어획량 통계와 랭킹</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 hover:scale-105 transition-all duration-500">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">🌪️ 예보</h2>
                        <p className="text-gray-600 leading-relaxed">파도, 바람, 조류 예보</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
