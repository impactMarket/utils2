import {
    BalanceType,
    ImpactMarketContext
} from '../components/ImpactMarketProvider';
import { useContracts } from './useContracts';
import React, { useEffect } from 'react';
import toNumber from '../helpers/toNumber';

export const useBalance = () => {
    const { cusd, pact: pactContract } = useContracts();
    const { balance, setBalance, address } =
        React.useContext(ImpactMarketContext);

    const updateBalance = async () => {
        if (!address || !cusd || !pactContract) {
            return;
        }

        try {
            const [cUSDBalance, pactBalance] = await Promise.all([
                cusd?.balanceOf(address),
                pactContract?.balanceOf(address)
            ]);

            const cUSD = toNumber(cUSDBalance);
            const pact = toNumber(pactBalance);

            return setBalance((balance: BalanceType) => ({
                ...balance,
                cusd: cUSD,
                pact
            }));
        } catch (error) {
            console.log(`Error getting balance...\n${error}`);
        }
    };

    useEffect(() => {
        updateBalance();
    }, [cusd, pactContract]);

    return { balance, updateBalance };
};
