import { EpochContext, ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { getLastEpochsDonations, updateEpochData, updateUserContributionData } from './updater';
import React, { useEffect } from 'react';
import type { BaseProvider } from '@ethersproject/providers';

export const updateEpoch = async (provider: BaseProvider, networkId: number, address: string) => {
    if (!address) {
        return;
    }
    const { donationMiner } = getContracts(provider, networkId);
    const [epochData, userContributionData, donations] = await Promise.all([
        updateEpochData(provider, donationMiner),
        updateUserContributionData(provider, donationMiner, address),
        getLastEpochsDonations(donationMiner, address)
    ]);

    return {
        ...epochData,
        ...userContributionData,
        donations
    };
};

export const useEpoch = () => {
    const { provider, address, networkId } = React.useContext(ImpactProviderContext);
    const { epoch, setEpoch } = React.useContext(EpochContext);

    useEffect(() => {
        if (address) {
            updateEpoch(provider, networkId, address).then(epochData => {
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
