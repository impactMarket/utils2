import { BaseProvider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { toNumber } from './toNumber';
import { getContracts } from './contracts';

export const usePACTBalance = (props: {
    address: string;
    provider: BaseProvider;
}) => {
    const [balance, setBalance] = useState<number>(0);
    const { address, provider } = props;

    const updatePACTBalance = async () => {
        const { pact: pactContract } = await getContracts(provider);
        if (!address || !pactContract?.provider) {
            return;
        }

        try {
            const pactBalance = await pactContract?.balanceOf(address);
            return setBalance(toNumber(pactBalance));
        } catch (error) {
            console.log(`Error getting balance...\n${error}`);
        }
    };

    useEffect(() => {
        updatePACTBalance();
    }, []);

    return { balance, updatePACTBalance };
};

export const useCUSDBalance = (props: {
    address: string;
    provider: BaseProvider;
}) => {
    const [balance, setBalance] = useState<number>(0);
    const { address, provider } = props;

    const updateCUSDBalance = async () => {
        const { cusd, donationMiner } = await getContracts(provider);
        if (!address || !donationMiner?.provider || !cusd?.provider) {
            return;
        }

        try {
            const cUSDBalance = await cusd?.balanceOf(address);
            return setBalance(toNumber(cUSDBalance));
        } catch (error) {
            console.log(`Error getting balance...\n${error}`);
        }
    };

    useEffect(() => {
        updateCUSDBalance();
    }, []);

    return {
        balance,
        updateCUSDBalance
    };
};
