import React, { useEffect } from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';

export const useEpoch = () => {
    const { epoch, updateEpoch } = React.useContext(ImpactMarketContext);

    useEffect(() => {
        updateEpoch();
    }, []);

    return { epoch };
};
