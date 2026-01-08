import { get, post, put, del } from './api';

// 어항의 모든 물고기 가져오기
export const getAllFishes = async () => {
    try {
        return await get( '/fish' );
    } catch ( error ) {
        throw new Error( '물고기 목록을 가져올 수 없습니다.' );
    }
};

// 새 물고기 추가 (사용자 입장)
export const addFish = async ( fishData ) => {
    try {
        return await post( '/fish', fishData );
    } catch ( error ) {
        throw new Error( '물고기를 추가할 수 없습니다.' );
    }
};

// 물고기 정보 업데이트
export const updateFish = async ( fishId, updateData ) => {
    try {
        return await put( `/fish/${ fishId }`, updateData );
    } catch ( error ) {
        throw new Error( '물고기 정보를 업데이트할 수 없습니다.' );
    }
};

// 물고기 위치 업데이트
export const updateFishPosition = async ( fishId, position ) => {
    try {
        return await put( `/fish/${ fishId }/position`, { position } );
    } catch ( error ) {
        // 위치 업데이트는 실패해도 크리티컬하지 않으므로 조용히 처리
        console.warn( '물고기 위치 업데이트 실패:', error );
    }
};

// 물고기 제거 (사용자 퇴장)
export const removeFish = async ( fishId ) => {
    try {
        return await del( `/fish/${ fishId }` );
    } catch ( error ) {
        throw new Error( '물고기를 제거할 수 없습니다.' );
    }
};

// 어항 설정 가져오기
export const getTankSettings = async () => {
    try {
        return await get( '/tank/settings' );
    } catch ( error ) {
        throw new Error( '어항 설정을 가져올 수 없습니다.' );
    }
};

// 어항 설정 업데이트
export const updateTankSettings = async ( settings ) => {
    try {
        return await put( '/tank/settings', settings );
    } catch ( error ) {
        throw new Error( '어항 설정을 업데이트할 수 없습니다.' );
    }
};