import { EpochContext, ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { getLastEpochsDonations, updateEpochData, updateUserContributionData } from './updater';
import React, { useEffect } from 'react';
import type { BaseProvider } from '@ethersproject/providers';

export const updateEpoch = async (provider: BaseProvider, address: string) => {
    if (!address) {
        return;
    }
    const { donationMiner, donationMinerOld } = await getContracts(provider);
    const [epochData, userContributionData, donations] = await Promise.all([
        updateEpochData(provider),
        updateUserContributionData(provider, address),
        getLastEpochsDonations(donationMiner, donationMinerOld, address)
    ]);

    return {
        ...epochData,
        ...userContributionData,
        donations
    };
};

export const useEpoch = () => {
    const { provider, address } = React.useContext(ImpactProviderContext);
    const { epoch, setEpoch } = React.useContext(EpochContext);

    useEffect(() => {
        if (address) {
            updateEpoch(provider, address).then(epochData => {
                setEpoch(epoch => ({
                    ...epoch,
                    ...epochData,
                    initialised: true
                }));
            });
        }
    }, []);

    return { epoch };
};
