import { useContracts } from './useContracts';
import { useContractKit } from '@celo-tools/use-contractkit';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

export const useVotingPower = () => {
    const { address } = useContractKit();
    const { pact: pactContract, delegate } = useContracts();
    const [enoughVotingPowerToPropose, setEnoughVotingPowerToPropose] =
        useState<boolean | undefined>(undefined);

    const updateVotingPower = async () => {
        if (!address || !delegate || !pactContract) {
            return;
        }

        try {
            const [proposalThreshold, currentVotes] = await Promise.all([
                delegate?.proposalThreshold(),
                pactContract?.getCurrentVotes(address)
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
