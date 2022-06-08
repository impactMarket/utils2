import { ImpactProviderContext } from './ImpactProvider';
import { Interface, defaultAbiCoder } from '@ethersproject/abi';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import BigNumber from 'bignumber.js';
import PACTDelegateABI from './abi/PACTDelegate.json';
import React from 'react';

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

export const useDAO = () => {
    const { connection, provider, address } = React.useContext(ImpactProviderContext);

    const addCommunity = async (community: CommunityArgs) => {
        const { cusd, delegate, addresses } = await getContracts(provider);

        if (!delegate || !addresses?.communityAdmin || !connection || !address) {
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
            const signatures = ['addCommunity(address[],uint256,uint256,uint256,uint256,uint256,uint256,uint256)'];

            const calldatas = [
                defaultAbiCoder.encode(
                    ['address[]', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
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

            const tx = await delegate.populateTransaction.propose(
                targets,
                values,
                signatures,
                calldatas,
                JSON.stringify({
                    description: proposalDescription,
                    title: proposalTitle
                })
            );
            const response = await executeTransaction(connection, address, cusd, tx);
            const ifaceDAO = new Interface(PACTDelegateABI);

            return parseInt(ifaceDAO.parseLog(response.logs[0]).args![0].toString(), 10);
        } catch (error) {
            console.log('Error in addCommunity function: \n', error);

            return undefined;
        }
    };

    return { addCommunity };
};
