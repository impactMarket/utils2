import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { getContracts } from '../utils/contracts';

export const useVotingPower = () => {
    const { address, provider } = React.useContext(ImpactMarketContext);
    const [enoughVotingPowerToPropose, setEnoughVotingPowerToPropose] =
        useState<boolean | undefined>(undefined);

    const updateVotingPower = async () => {
        const { pact: pactContract, delegate } = await getContracts(provider);
        if (
            address === null ||
            !delegate?.address ||
            !delegate?.provider ||
            !pactContract?.address ||
            !pactContract?.provider
        ) {
            return;
        }

        try {
            const [proposalThreshold, currentVotes] = await Promise.all([
                delegate.proposalThreshold(),
                pactContract.getCurrentVotes(address)
            ]);

            return setEnoughVotingPowerToPropose(
                new BigNumber(currentVotes.toString()).gte(
                    proposalThreshold.toString()
                )
            );
        } catch (error) {
            console.log(`Error getting voting power...\n${error}`);
        }
    };

    useEffect(() => {
        updateVotingPower();
    }, []);

    return { enoughVotingPowerToPropose };
};
