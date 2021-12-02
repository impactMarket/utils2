import { useContracts } from './useContracts';
import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';

export const useVotingPower = () => {
    const { pact: pactContract, delegate } = useContracts();
    const [enoughVotingPowerToPropose, setEnoughVotingPowerToPropose] =
        useState<boolean | undefined>(undefined);
    const { address } = React.useContext(ImpactMarketContext);

    const updateVotingPower = async () => {
        if (address === null || !delegate?.address || !pactContract?.address) {
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
            console.log(`Error getting balance...\n${error}`);
        }
    };

    useEffect(() => {
        updateVotingPower();
    }, [delegate, pactContract]);

    return { enoughVotingPowerToPropose };
};
