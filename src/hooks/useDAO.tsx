import BigNumber from 'bignumber.js';
import { defaultAbiCoder } from 'ethers/lib/utils';
import React from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';
import { getContracts } from '../utils/contracts';

type UseDAOType = {
    addCommunity: Function;
};

type CommunityArgs = {
    baseInterval: string | BigNumber;
    claimAmount: string | BigNumber;
    decreaseStep: string | BigNumber;
    managers: string[];
    incrementInterval: string | BigNumber;
    maxClaim: string | BigNumber;
    maxTranche: string | BigNumber;
    minTranche: string | BigNumber;
    proposalTitle: string;
    proposalDescription: string;
};

export const useDAO = (): UseDAOType => {
    const { provider, signer } = React.useContext(ImpactMarketContext);

    const addCommunity = async (community: CommunityArgs) => {
        const { delegate, addresses } = await getContracts(provider);
        if (!delegate || !addresses?.communityAdmin || !signer) {
            return;
        }

        try {
            const {
                baseInterval,
                claimAmount,
                decreaseStep,
                managers,
                incrementInterval,
                maxClaim,
                maxTranche,
                minTranche,
                proposalTitle,
                proposalDescription
            } = community;
            const targets = [addresses.communityAdmin];
            const values = [0];
            const signatures = [
                'addCommunity(address[],uint256,uint256,uint256,uint256,uint256,uint256,uint256)'
            ];

            const calldatas = [
                defaultAbiCoder.encode(
                    [
                        'address[]',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256'
                    ],
                    [
                        managers,
                        claimAmount,
                        maxClaim,
                        decreaseStep,
                        baseInterval,
                        incrementInterval,
                        minTranche,
                        maxTranche
                    ]
                )
            ];

            const tx = await delegate.connect(signer).propose(
                targets,
                values,
                signatures,
                calldatas,
                JSON.stringify({
                    title: proposalTitle,
                    description: proposalDescription
                })
            );

            const response = await tx.wait();

            return parseInt(response.events![0].args![0].toString(), 10);
        } catch (error) {
            console.log('Error in addCommunity function: \n', error);
            return undefined;
        }
    };

    return { addCommunity };
};
