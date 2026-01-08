// 물고기 타입 상수
export const FISH_TYPES = {
    GOLDFISH: 'goldfish',
    TROPICAL: 'tropical',
    SHARK: 'shark',
    WHALE: 'whale',
    OCTOPUS: 'octopus',
    CRAB: 'crab',
    SEAL: 'seal',
    PUFFERFISH: 'pufferfish',
    CROCODILE: 'crocodile',
    CORAL: 'coral',
    FROG: 'frog',
    SHELL: 'shell'
};

// 물고기 타입별 정보
export const FISH_INFO = {
    [ FISH_TYPES.GOLDFISH ]: {
        label: '금붕어',
        emoji: '🐠',
        speed: 1.2,
        size: 'medium'
    },
    [ FISH_TYPES.TROPICAL ]: {
        label: '열대어',
        emoji: '🐟',
        speed: 1.5,
        size: 'small'
    },
    [ FISH_TYPES.SHARK ]: {
        label: '상어',
        emoji: '🦈',
        speed: 1.0,
        size: 'large'
    },
    [ FISH_TYPES.WHALE ]: {
        label: '고래',
        emoji: '🐋',
        speed: 0.8,
        size: 'xlarge'
    },
    [ FISH_TYPES.OCTOPUS ]: {
        label: '문어',
        emoji: '🐙',
        speed: 1.8,
        size: 'medium'
    },
    [ FISH_TYPES.CRAB ]: {
        label: '게',
        emoji: '🦀',
        speed: 3.0,
        size: 'small'
    },
    [ FISH_TYPES.SEAL ]: {
        label: '물개',
        emoji: '🦭',
        speed: 1.3,
        size: 'large'
    },
    [ FISH_TYPES.PUFFERFISH ]: {
        label: '복어',
        emoji: '🐡',
        speed: 0.9,
        size: 'medium'
    },
    [ FISH_TYPES.CROCODILE ]: {
        label: '악어',
        emoji: '🐊',
        speed: 0.7,
        size: 'xlarge'
    },
    [ FISH_TYPES.CORAL ]: {
        label: '산호',
        emoji: '🪸',
        speed: 0.3,
        size: 'small'
    },
    [ FISH_TYPES.FROG ]: {
        label: '개구리',
        emoji: '🐸',
        speed: 1.1,
        size: 'medium'
    },
    [ FISH_TYPES.SHELL ]: {
        label: '소라',
        emoji: '🐚',
        speed: 0.4,
        size: 'small'
    }
};

// 물고기 타입 배열을 FISH_INFO에서 생성하는 헬퍼 함수
export const getFishTypeOptions = () => {
    return Object.keys( FISH_INFO ).map( fishType => ( {
        value: fishType,
        label: FISH_INFO[ fishType ].label,
        emoji: FISH_INFO[ fishType ].emoji,
        speed: FISH_INFO[ fishType ].speed,
        size: FISH_INFO[ fishType ].size
    } ) );
};

// 스피드를 사용자 친화적 텍스트로 변환
export const getSpeedText = ( speed ) => {
    if ( speed <= 0.4 ) return '매우 느림';
    if ( speed <= 0.8 ) return '느림';
    if ( speed <= 1.2 ) return '보통';
    if ( speed <= 1.5 ) return '빠름';
    return '매우 빠름';
};

// 사이즈를 사용자 친화적 텍스트로 변환
export const getSizeText = ( size ) => {
    switch ( size ) {
        case 'small': return '작음';
        case 'medium': return '보통';
        case 'large': return '큼';
        case 'xlarge': return '매우 큼';
        default: return '보통';
    }
};

// 어항 설정
export const TANK_SETTINGS = {
    MAX_CAPACITY: 20,
    MIN_TEMPERATURE: 18,
    MAX_TEMPERATURE: 30,
    DEFAULT_TEMPERATURE: 24
};

// 애니메이션 설정
export const ANIMATION_CONFIG = {
    FISH_MOVE_INTERVAL: {
        MIN: 1000,  // 1초 (더 빠르게)
        MAX: 3000   // 3초 (더 빠르게)
    },
    FISH_MOVE_DISTANCE: {
        X: 8,  // 더 큰 움직임
        Y: 6   // 더 큰 움직임
    },
    BOUNDARIES: {
        X_MIN: 5,   // 경계를 더 여유롭게
        X_MAX: 95,  // 경계를 더 여유롭게
        Y_MIN: 10,  // 경계를 더 여유롭게
        Y_MAX: 80   // Y 최대값을 80%로 더 줄임
    }
};