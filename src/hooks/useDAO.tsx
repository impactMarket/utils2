import BigNumber from 'bignumber.js';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useContracts } from '../hooks/useContracts';

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
                managers,
                incrementInterval,
                maxClaim,
                maxTranche,
                minTranche,
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

            const tx = await delegate.propose(
                targets,
                values,
                signatures,
                calldatas,
                proposalDescription
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
