import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useContracts } from '../hooks/useContracts';

type UseDAOType = {
    addCommunity?: Function;
};

type CommunityArgs = {
    proposalDescription: string;
    firstManager: string;
    claimAmount: string | BigNumber;
    maxClaim: string | BigNumber;
    decreaseStep: string | BigNumber;
    baseInterval: string | BigNumber;
    incrementInterval: string | BigNumber;
    minTranche: string | BigNumber;
    maxTranche: string | BigNumber;
    managerBlockList: string[];
};

export const useDAO = (): UseDAOType => {
    const { addresses, delegate } = useContracts();

    const addCommunity = async (community: CommunityArgs) => {
        if (!delegate || !addresses?.communityAdmin) {
            return;
        }

        try {
            const {
                proposalDescription,
                firstManager,
                claimAmount,
                maxClaim,
                decreaseStep,
                baseInterval,
                incrementInterval,
                minTranche,
                maxTranche,
                managerBlockList
            } = community;
            const targets = addresses.communityAdmin;
            const values = [0];
            const signatures = [
                'addCommunity(address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address[])'
            ];

            const calldatas = [
                ethers.utils.defaultAbiCoder.encode(
                    [
                        'address',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256',
                        'uint256',
                        'address[]'
                    ],
                    [
                        firstManager,
                        claimAmount,
                        maxClaim,
                        decreaseStep,
                        baseInterval,
                        incrementInterval,
                        minTranche,
                        maxTranche,
                        managerBlockList
                    ]
                )
            ];

            const response = await delegate.propose(
                targets,
                values,
                signatures,
                calldatas,
                proposalDescription
            );

            return response;
        } catch (error) {
            console.log('Error in addCommunity function: \n', error);
        }
    };

    return { addCommunity };
};
