import { ImpactProviderContext, PACTBalanceContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { toNumber } from './toNumber';
import React, { useEffect } from 'react';
import type { BaseProvider } from '@ethersproject/providers';

export const updatePACTBalance = async (provider: BaseProvider, networkId: number, address: string) => {
    const { pact } = getContracts(provider, networkId);

    if (!address || !pact?.provider) {
        return 0;
    }

    try {
        const pactBalance = await pact?.balanceOf(address);

        return toNumber(pactBalance);
    } catch (error) {
        console.log(`Error getting balance...\n${error}`);

        return 0;
    }
};

export const usePACTBalance = () => {
    const { provider, address, networkId } = React.useContext(ImpactProviderContext);
    const { balance, setBalance } = React.useContext(PACTBalanceContext);

    useEffect(() => {
        if (address) {
            updatePACTBalance(provider, networkId, address).then(b => setBalance(b));
        }
    }, [address]);

    return balance;
};
