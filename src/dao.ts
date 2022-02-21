import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { defaultAbiCoder } from '@ethersproject/abi';
import { getContracts } from './contracts';
import BigNumber from 'bignumber.js';

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

export class DAO {
    private provider: BaseProvider;
    private signer: Signer | null;

    constructor(_provider: BaseProvider, _signer: Signer | null) {
        this.provider = _provider;
        this.signer = _signer;
    }

    addCommunity = async (community: CommunityArgs) => {
        const { delegate, addresses } = await getContracts(this.provider);

        if (!delegate || !addresses?.communityAdmin || !this.signer) {
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

            const tx = await delegate.connect(this.signer).propose(
                targets,
                values,
                signatures,
                calldatas,
                JSON.stringify({
                    description: proposalDescription,
                    title: proposalTitle,
                })
            );

            const response = await tx.wait();

            return parseInt(response.events![0].args![0].toString(), 10);
        } catch (error) {
            console.log('Error in addCommunity function: \n', error);

            return undefined;
        }
    };
}
