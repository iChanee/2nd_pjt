import { getFishInfo as getFishInfoFromConstants, ANIMATION_CONFIG } from './constants';

// 랜덤 위치 생성
export const generateRandomPosition = () => ( {
    x: Math.random() * ( ANIMATION_CONFIG.BOUNDARIES.X_MAX - ANIMATION_CONFIG.BOUNDARIES.X_MIN ) + ANIMATION_CONFIG.BOUNDARIES.X_MIN,
    y: Math.random() * ( ANIMATION_CONFIG.BOUNDARIES.Y_MAX - ANIMATION_CONFIG.BOUNDARIES.Y_MIN ) + ANIMATION_CONFIG.BOUNDARIES.Y_MIN
} );

// 물고기 정보 가져오기 (constants.js의 함수 사용)
export const getFishInfo = ( fishType ) => {
    return getFishInfoFromConstants( fishType );
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

// 랜덤 이동 거리 계산 (물고기별 개별 움직임)
export const calculateRandomMovement = ( fishType ) => {
    const fishInfo = getFishInfo( fishType );
    const speedMultiplier = fishInfo.speed || 1;

    // 기본 랜덤 움직임
    const baseMovement = {
        x: ( Math.random() - 0.5 ) * ANIMATION_CONFIG.FISH_MOVE_DISTANCE.X * speedMultiplier,
        y: ( Math.random() - 0.5 ) * ANIMATION_CONFIG.FISH_MOVE_DISTANCE.Y * speedMultiplier
    };

    // 가끔 큰 점프 움직임 (20% 확률)
    if ( Math.random() < 0.2 ) {
        baseMovement.x *= 2.5;
        baseMovement.y *= 2.5;
    }

    // 물고기 타입별 특별한 움직임 패턴
    switch ( fishType ) {
        case 'shark':
            // 상어는 직선적이고 빠른 움직임
            baseMovement.x *= 1.5;
            baseMovement.y *= 0.8;
            break;
        case 'octopus':
            // 문어는 불규칙한 움직임
            baseMovement.x *= ( 0.5 + Math.random() * 1.5 );
            baseMovement.y *= ( 0.5 + Math.random() * 1.5 );
            break;
        case 'whale':
            // 고래는 느리지만 큰 움직임
            baseMovement.x *= 0.8;
            baseMovement.y *= 1.2;
            break;
        case 'crab':
            // 게는 주로 좌우 움직임
            baseMovement.x *= 1.5;
            baseMovement.y *= 0.6;
            break;
        case 'tropical':
            // 열대어는 빠르고 활발한 움직임
            baseMovement.x *= 1.3;
            baseMovement.y *= 1.4;
            break;
        case 'seal':
            // 물개는 활발하고 큰 움직임
            baseMovement.x *= 1.2;
            baseMovement.y *= 1.6;
            break;
        case 'pufferfish':
            // 복어는 느리고 조심스러운 움직임
            baseMovement.x *= 0.7;
            baseMovement.y *= 0.8;
            break;
        case 'crocodile':
            // 악어는 매우 느리고 직선적인 움직임
            baseMovement.x *= 0.6;
            baseMovement.y *= 0.4;
            break;
        case 'coral':
            // 산호는 거의 움직이지 않음
            baseMovement.x *= 0.2;
            baseMovement.y *= 0.1;
            break;
        case 'frog':
            // 개구리는 점프하는 움직임
            if ( Math.random() < 0.3 ) {
                baseMovement.x *= 2.0; // 큰 점프
                baseMovement.y *= 3.0;
            } else {
                baseMovement.x *= 0.5; // 작은 움직임
                baseMovement.y *= 0.3;
            }
            break;
        case 'shell':
            // 소라는 매우 느리고 바닥 위주 움직임
            baseMovement.x *= 0.4;
            baseMovement.y *= 0.2;
            // 바닥쪽으로 더 많이 이동
            if ( Math.random() < 0.7 ) {
                baseMovement.y = Math.abs( baseMovement.y );
            }
            break;
        case 'jellyfish':
            // 해파리는 위아래로 부드럽게 떠다니는 움직임
            baseMovement.x *= 0.6;
            baseMovement.y *= 1.8;
            // 위아래 움직임이 더 부드럽게
            if ( Math.random() < 0.6 ) {
                baseMovement.y *= ( Math.random() < 0.5 ? 1 : -1 );
            }
            break;
        case 'shrimp':
            // 새우는 빠르고 튀는 듯한 움직임
            baseMovement.x *= 1.8;
            baseMovement.y *= 1.5;
            // 가끔 급격한 방향 전환 (30% 확률)
            if ( Math.random() < 0.3 ) {
                baseMovement.x *= -2.0;
                baseMovement.y *= 1.5;
            }
            break;
        case 'otter':
            // 해달은 활발하고 장난스러운 움직임
            baseMovement.x *= 1.4;
            baseMovement.y *= 1.7;
            // 가끔 회전하듯 움직임 (25% 확률)
            if ( Math.random() < 0.25 ) {
                baseMovement.x *= 1.5;
                baseMovement.y *= -1.2;
            }
            break;
        case 'turtle':
            // 거북이는 매우 느리고 꾸준한 움직임
            baseMovement.x *= 0.5;
            baseMovement.y *= 0.6;
            // 직선적인 움직임 선호 (70% 확률)
            if ( Math.random() < 0.7 ) {
                if ( Math.abs( baseMovement.x ) > Math.abs( baseMovement.y ) ) {
                    baseMovement.y *= 0.3;
                } else {
                    baseMovement.x *= 0.3;
                }
            }
            break;
        default:
            // 금붕어는 기본 움직임
            baseMovement.x *= 1.0;
            baseMovement.y *= 1.2;
            break;
    }

    // console.log( `🎯 ${ fishType } 움직임:`, baseMovement );
    return baseMovement;
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