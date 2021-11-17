import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useContracts } from '../hooks/useContracts';

type UseDAOType = {
    addCommunity?: Function;
};

type CommunityArgs = {
    baseInterval: string | BigNumber;
    claimAmount: string | BigNumber;
    decreaseStep: string | BigNumber;
    firstManager: string;
    incrementInterval: string | BigNumber;
    managerBlockList: string[];
    maxClaim: string | BigNumber;
    maxTranche: string | BigNumber;
    minTranche: string | BigNumber;
    proposalDescription: string;
};

export const useDAO = (): UseDAOType => {
    const { addresses, delegate } = useContracts();

    const addCommunity = async (community: CommunityArgs) => {
        if (!delegate || !addresses?.communityAdmin) {
            return;
        }

        try {
            const {
                baseInterval,
                claimAmount,
                decreaseStep,
                firstManager,
                incrementInterval,
                managerBlockList,
                maxClaim,
                maxTranche,
                minTranche,
                proposalDescription
            } = community;
            const targets = [addresses.communityAdmin];
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

            const tx = await delegate.propose(
                targets,
                values,
                signatures,
                calldatas,
                proposalDescription
            );

            const response = await tx.wait();

            return response;
        } catch (error) {
            console.log('Error in addCommunity function: \n', error);
        }
    };

    return { addCommunity };
};
