import { get, post, put, del } from './api';

// 어항의 모든 물고기 가져오기 (현재는 세션 기반이므로 추후 구현)
export const getAllFishes = async () => {
    try {
        // 추후 실시간 세션 API 구현 시 사용
        return await get( '/fish' );
    } catch ( error ) {
        console.warn( '물고기 목록 API 미구현:', error );
        return [];
    }
};

// 새 물고기 추가 (사용자 입장) - 추후 세션 관리 API로 구현
export const addFish = async ( fishData ) => {
    try {
        return await post( '/fish', fishData );
    } catch ( error ) {
        console.warn( '물고기 추가 API 미구현:', error );
        throw new Error( '물고기를 추가할 수 없습니다.' );
    }
};

// 물고기 정보 업데이트 - 추후 구현
export const updateFish = async ( fishId, updateData ) => {
    try {
        return await put( `/fish/${ fishId }`, updateData );
    } catch ( error ) {
        console.warn( '물고기 업데이트 API 미구현:', error );
        throw new Error( '물고기 정보를 업데이트할 수 없습니다.' );
    }
};

// 물고기 위치 업데이트 - 추후 실시간 기능으로 구현
export const updateFishPosition = async ( fishId, position ) => {
    try {
        return await put( `/fish/${ fishId }/position`, { position } );
    } catch ( error ) {
        // 위치 업데이트는 실패해도 크리티컬하지 않으므로 조용히 처리
        console.warn( '물고기 위치 업데이트 실패:', error );
    }
};

// 물고기 제거 (사용자 퇴장) - 추후 구현
export const removeFish = async ( fishId ) => {
    try {
        return await del( `/fish/${ fishId }` );
    } catch ( error ) {
        console.warn( '물고기 제거 API 미구현:', error );
        throw new Error( '물고기를 제거할 수 없습니다.' );
    }
};

// 어항 설정 가져오기 - 추후 구현
export const getTankSettings = async () => {
    try {
        return await get( '/tank/settings' );
    } catch ( error ) {
        console.warn( '어항 설정 API 미구현:', error );
        // 기본 설정 반환
        return {
            theme: 'ocean',
            capacity: 10,
            temperature: 24
        };
    }
};

// 어항 설정 업데이트 - 추후 구현
export const updateTankSettings = async ( settings ) => {
    try {
        return await put( '/tank/settings', settings );
    } catch ( error ) {
        console.warn( '어항 설정 업데이트 API 미구현:', error );
        throw new Error( '어항 설정을 업데이트할 수 없습니다.' );
    }
};