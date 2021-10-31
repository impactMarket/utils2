import { BalanceType, DaoContext } from '../components/DaoProvider';
import { useContracts } from './useContracts';
import { useContractKit } from '@celo-tools/use-contractkit';
import React, { useEffect } from 'react';
import toNumber from '../helpers/toNumber';

export const useBalance = () => {
    const { address } = useContractKit();
    const { cusd, pact: pactContract } = useContracts();
    const { balance, setBalance } = React.useContext(DaoContext);

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
