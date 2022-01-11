import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import React, { useEffect } from 'react';

export const usePACTBalance = () => {
    const { balance, updatePACTBalance } =
        React.useContext(ImpactMarketContext);

    useEffect(() => {
        updatePACTBalance();
    }, []);

    return { balance: balance?.pact };
};

export const useCUSDBalance = () => {
    const { balance, updateCUSDBalance } =
        React.useContext(ImpactMarketContext);

    useEffect(() => {
        updateCUSDBalance();
    }, []);

    return {
        balance: balance?.cusd
    };
};
