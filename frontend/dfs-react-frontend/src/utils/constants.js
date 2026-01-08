// 물고기 타입 상수
export const FISH_TYPES = {
    GOLDFISH: 'goldfish',
    TROPICAL: 'tropical',
    SHARK: 'shark',
    WHALE: 'whale',
    OCTOPUS: 'octopus',
    CRAB: 'crab'
};

// 물고기 타입별 정보
export const FISH_INFO = {
    [ FISH_TYPES.GOLDFISH ]: {
        label: '금붕어',
        emoji: '🐠',
        speed: 1,
        size: 'medium'
    },
    [ FISH_TYPES.TROPICAL ]: {
        label: '열대어',
        emoji: '🐟',
        speed: 1.2,
        size: 'small'
    },
    [ FISH_TYPES.SHARK ]: {
        label: '상어',
        emoji: '🦈',
        speed: 0.8,
        size: 'large'
    },
    [ FISH_TYPES.WHALE ]: {
        label: '고래',
        emoji: '🐋',
        speed: 0.5,
        size: 'xlarge'
    },
    [ FISH_TYPES.OCTOPUS ]: {
        label: '문어',
        emoji: '🐙',
        speed: 1.5,
        size: 'medium'
    },
    [ FISH_TYPES.CRAB ]: {
        label: '게',
        emoji: '🦀',
        speed: 0.7,
        size: 'small'
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
        MIN: 2000,
        MAX: 5000
    },
    FISH_MOVE_DISTANCE: {
        X: 2,
        Y: 1
    },
    BOUNDARIES: {
        X_MIN: 5,
        X_MAX: 95,
        Y_MIN: 10,
        Y_MAX: 85
    }
};