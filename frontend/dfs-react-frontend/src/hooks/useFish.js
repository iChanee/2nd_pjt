import { useContext } from 'react';
import { FishContext } from '../contexts/FishContext';

// FishContext를 사용하는 커스텀 훅
export const useFish = () => {
    const context = useContext( FishContext );

    if ( !context ) {
        throw new Error( 'useFish must be used within a FishProvider' );
    }

    return context;
};