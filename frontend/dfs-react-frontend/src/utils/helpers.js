import { FISH_INFO, ANIMATION_CONFIG } from './constants';

// 랜덤 위치 생성
export const generateRandomPosition = () => ( {
    x: Math.random() * ( ANIMATION_CONFIG.BOUNDARIES.X_MAX - ANIMATION_CONFIG.BOUNDARIES.X_MIN ) + ANIMATION_CONFIG.BOUNDARIES.X_MIN,
    y: Math.random() * ( ANIMATION_CONFIG.BOUNDARIES.Y_MAX - ANIMATION_CONFIG.BOUNDARIES.Y_MIN ) + ANIMATION_CONFIG.BOUNDARIES.Y_MIN
} );

// 물고기 정보 가져오기
export const getFishInfo = ( fishType ) => {
    return FISH_INFO[ fishType ] || FISH_INFO.goldfish;
};

// 물고기 이모지 가져오기
export const getFishEmoji = ( fishType ) => {
    return getFishInfo( fishType ).emoji;
};

// 경계 체크 및 위치 조정
export const clampPosition = ( position ) => ( {
    x: Math.max( ANIMATION_CONFIG.BOUNDARIES.X_MIN, Math.min( ANIMATION_CONFIG.BOUNDARIES.X_MAX, position.x ) ),
    y: Math.max( ANIMATION_CONFIG.BOUNDARIES.Y_MIN, Math.min( ANIMATION_CONFIG.BOUNDARIES.Y_MAX, position.y ) )
} );

// 랜덤 이동 거리 계산
export const calculateRandomMovement = ( fishType ) => {
    const fishInfo = getFishInfo( fishType );
    const speedMultiplier = fishInfo.speed || 1;

    return {
        x: ( Math.random() - 0.5 ) * ANIMATION_CONFIG.FISH_MOVE_DISTANCE.X * speedMultiplier,
        y: ( Math.random() - 0.5 ) * ANIMATION_CONFIG.FISH_MOVE_DISTANCE.Y * speedMultiplier
    };
};

// 랜덤 이동 간격 계산
export const getRandomMoveInterval = () => {
    return Math.random() * ( ANIMATION_CONFIG.FISH_MOVE_INTERVAL.MAX - ANIMATION_CONFIG.FISH_MOVE_INTERVAL.MIN ) + ANIMATION_CONFIG.FISH_MOVE_INTERVAL.MIN;
};

// 시간 포맷팅
export const formatTime = ( date ) => {
    return new Date( date ).toLocaleTimeString( 'ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
    } );
};

// 날짜 포맷팅
export const formatDate = ( date ) => {
    return new Date( date ).toLocaleDateString( 'ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    } );
};

// 활동 시간 계산 (분 단위)
export const calculateActiveTime = ( joinedAt ) => {
    return Math.round( ( Date.now() - new Date( joinedAt ) ) / 60000 );
};