import { EpochContext, ImpactProviderContext } from './ImpactProvider';
import { getContracts } from './contracts';
import { getLastEpochsDonations, updateEpochData, updateUserContributionData } from './updater';
import React, { useEffect } from 'react';
import type { CeloProvider } from './ethers-wrapper/CeloProvider';

export const updateEpoch = async (provider: CeloProvider, address: string) => {
    if (!address) {
        return;
    }
    const { donationMiner } = await getContracts(provider);
    const [epochData, userContributionData, donations] = await Promise.all([
        updateEpochData(provider),
        updateUserContributionData(provider, address),
        getLastEpochsDonations(donationMiner, address)
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
