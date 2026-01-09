import { get } from './api';

// 모든 물고기 타입 조회
export const getAllFishTypes = async () => {
    try {
        return await get( '/fish-types' );
    } catch ( error ) {
        throw new Error( error.message || '물고기 타입을 가져올 수 없습니다.' );
    }
};

// 특정 물고기 타입 조회
export const getFishType = async ( typeCode ) => {
    try {
        return await get( `/fish-types/${ typeCode }` );
    } catch ( error ) {
        throw new Error( error.message || '물고기 타입 정보를 가져올 수 없습니다.' );
    }
};

// 물고기 타입 정보를 로컬에서 포맷팅
export const formatFishTypeInfo = ( fishType ) => {
    if ( !fishType ) return null;

    return {
        typeCode: fishType.typeCode,
        label: fishType.nameKo,
        labelEn: fishType.nameEn,
        emoji: fishType.emoji,
        speed: parseFloat( fishType.speed ),
        size: fishType.sizeCategory?.toLowerCase() || 'medium',
        isActive: fishType.isActive
    };
};

// 물고기 타입 목록을 프론트엔드 형식으로 변환
export const formatFishTypeOptions = ( fishTypes ) => {
    return fishTypes.map( formatFishTypeInfo ).filter( type => type.isActive );
};