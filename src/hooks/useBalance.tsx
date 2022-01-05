import {
    BalanceType,
    ImpactMarketContext
} from '../components/ImpactMarketProvider';
import React, { useEffect } from 'react';
import { toNumber } from '../helpers/toNumber';

export const useBalance = () => {
    const { balance, setBalance, address, contracts } =
        React.useContext(ImpactMarketContext);
    const { cusd, donationMiner, pact: pactContract } = contracts;

    const updateBalance = async () => {
        if (
            !address ||
            !donationMiner?.provider ||
            !cusd?.provider ||
            !pactContract?.provider
        ) {
            return;
        }

        try {
            const [cUSDAllowance, cUSDBalance, pactBalance] = await Promise.all(
                [
                    cusd.allowance(address, donationMiner.address),
                    cusd?.balanceOf(address),
                    pactContract?.balanceOf(address)
                ]
            );

            const cusdAllowance = toNumber(cUSDAllowance);
            const cUSD = toNumber(cUSDBalance);
            const pact = toNumber(pactBalance);

            return setBalance((balance: BalanceType) => ({
                ...balance,
                cusdAllowance,
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
