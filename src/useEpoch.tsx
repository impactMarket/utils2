import { BaseProvider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { getContracts } from './contracts';
import {
    getLastEpochsDonations,
    updateEpochData,
    updateUserContributionData
} from './updater';

export type EpochType = {
    endPeriod?: string;
    rewards: number;
    totalRaised: number;
    userContribution: number;
    donations: {
        user: number;
        everyone: number;
    };
    initialised: boolean;
};

const initialEpoch = {
    endPeriod: undefined,
    rewards: 0,
    totalRaised: 0,
    userContribution: 0,
    donations: {
        user: 0,
        everyone: 0
    },
    initialised: false
};

export const useEpoch = (props: {
    address: string;
    provider: BaseProvider;
}) => {
    const [epoch, setEpoch] = useState<EpochType>(initialEpoch);
    const { address, provider } = props;

    const updateEpoch = async () => {
        if (!address) {
            return;
        }
        setEpoch((epoch: EpochType) => ({
            ...epoch,
            initialised: false
        }));
        const { donationMiner } = await getContracts(provider);
        const [epochData, userContributionData, donations] = await Promise.all([
            updateEpochData(provider),
            updateUserContributionData(provider, address),
            getLastEpochsDonations(donationMiner, address)
        ]);
        setEpoch((epoch: EpochType) => ({
            ...epoch,
            ...epochData,
            ...userContributionData,
            donations,
            initialised: true
        }));
    };

    useEffect(() => {
        updateEpoch();
    }, []);

    return { epoch, updateEpoch };
};
