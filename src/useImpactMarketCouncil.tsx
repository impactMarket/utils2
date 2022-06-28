import { BigNumber } from 'bignumber.js';
import { ImpactProviderContext } from './ImpactProvider';
import { Interface, defaultAbiCoder } from '@ethersproject/abi';
import { executeTransaction } from './executeTransaction';
import { getContracts } from './contracts';
import ImpactMarketCouncilABI from './abi/ImpactMarketCouncil.json';
import React, { useEffect, useState } from 'react';

type BaseProposalArgs = {
    proposalTitle: string;
    proposalDescription: string;
};

type CommunityAddArgs = BaseProposalArgs & {
    baseInterval: string | BigNumber;
    claimAmount: string | BigNumber;
    decreaseStep: string | BigNumber;
    ambassador: string;
    managers: string[];
    incrementInterval: string | BigNumber;
    maxClaim: string | BigNumber;
    maxTranche: string | BigNumber;
    minTranche: string | BigNumber;
    maxBeneficiaries: number;
};
type CommunityRemoveArgs = BaseProposalArgs & {
    communityAddress: string;
};
type CommunityUpdateParamsArgs = BaseProposalArgs & {
    communityAddress: string;
    minTranche: string | BigNumber;
    maxTranche: string | BigNumber;
};
type CommunityUpdateBeneficiaryParamsArgs = BaseProposalArgs & {
    communityAddress: string;
    baseInterval: string | BigNumber;
    incrementInterval: string | BigNumber;
    claimAmount: string | BigNumber;
    maxClaim: string | BigNumber;
    maxBeneficiaries: number;
    decreaseStep: string | BigNumber;
};

export const useImpactMarketCouncil = () => {
    const { connection, address, provider, ubiManagementSubgraph } = React.useContext(ImpactProviderContext);
    const [quorumVotes, setQuorumVotes] = useState<number>(0);
    const [proposalCount, setProposalCount] = useState<number>(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (connection) {
            const getState = async () => {
                const { impactMarketCouncil } = await getContracts(provider);
                const quorumVotes = await impactMarketCouncil.quorumVotes();
                const proposalCount = await impactMarketCouncil.proposalCount();

                setQuorumVotes(quorumVotes.toNumber());
                setProposalCount(proposalCount.toNumber());
                setIsReady(true);
            };

            getState();
        }
    }, [connection]);

    /**
     * @dev Generates proposal to create new community
     * @param {CommunityArgs} community community parameters
     * @returns {Promise<number>} proposal id
     */
    const addCommunity = async (community: CommunityAddArgs) => {
        if (!connection || !address) {
            return;
        }
        const { cusd, impactMarketCouncil } = await getContracts(provider);
        const {
            baseInterval,
            claimAmount,
            decreaseStep,
            managers,
            ambassador,
            incrementInterval,
            maxClaim,
            maxTranche,
            minTranche,
            maxBeneficiaries,
            proposalTitle,
            proposalDescription
        } = community;
        const signatures = [
            'addCommunity(address[],address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)'
        ];

        const calldatas = [
            defaultAbiCoder.encode(
                [
                    'address[]',
                    'address',
                    'uint256',
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
                    ambassador,
                    claimAmount,
                    maxClaim,
                    decreaseStep,
                    baseInterval,
                    incrementInterval,
                    minTranche,
                    maxTranche,
                    maxBeneficiaries
                ]
            )
        ];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            signatures,
            calldatas,
            JSON.stringify({
                description: proposalDescription,
                title: proposalTitle
            })
        );
        const response = await executeTransaction(connection, address, cusd, tx);
        const ifaceDAO = new Interface(ImpactMarketCouncilABI);

        // TODO: filter out events
        return parseInt(ifaceDAO.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * @dev Generates proposal to remove a community
     * @param {CommunityRemoveArgs} community community parameters
     * @returns {Promise<number>} proposal id
     */
    const removeCommunity = async (community: CommunityRemoveArgs) => {
        if (!connection || !address) {
            return;
        }
        const { cusd, impactMarketCouncil } = await getContracts(provider);
        const { communityAddress, proposalTitle, proposalDescription } = community;
        const signatures = ['removeCommunity(address)'];

        const calldatas = [defaultAbiCoder.encode(['address'], [communityAddress])];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            signatures,
            calldatas,
            JSON.stringify({
                description: proposalDescription,
                title: proposalTitle
            })
        );
        const response = await executeTransaction(connection, address, cusd, tx);
        const ifaceDAO = new Interface(ImpactMarketCouncilABI);

        return parseInt(ifaceDAO.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * @dev Generates proposal to change community params
     * @param {CommunityUpdateParamsArgs} community community parameters
     * @returns {Promise<number>} proposal id
     */
    const updateCommunityParams = async (community: CommunityUpdateParamsArgs) => {
        if (!connection || !address) {
            return;
        }
        const { cusd, impactMarketCouncil } = await getContracts(provider);
        const { communityAddress, minTranche, maxTranche, proposalTitle, proposalDescription } = community;
        const signatures = ['updateCommunityParams(address,uint256,uint256)'];

        const calldatas = [
            defaultAbiCoder.encode(['address', 'uint256', 'uint256'], [communityAddress, minTranche, maxTranche])
        ];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            signatures,
            calldatas,
            JSON.stringify({
                description: proposalDescription,
                title: proposalTitle
            })
        );
        const response = await executeTransaction(connection, address, cusd, tx);
        const ifaceDAO = new Interface(ImpactMarketCouncilABI);

        return parseInt(ifaceDAO.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * @dev Generates proposal to change community beneficiary params
     * @param {CommunityUpdateBeneficiaryParamsArgs} community community parameters
     * @returns {Promise<number>} proposal id
     */
    const updateBeneficiaryParams = async (community: CommunityUpdateBeneficiaryParamsArgs) => {
        if (!connection || !address) {
            return;
        }
        const { cusd, impactMarketCouncil } = await getContracts(provider);
        const {
            communityAddress,
            baseInterval,
            claimAmount,
            decreaseStep,
            incrementInterval,
            maxClaim,
            maxBeneficiaries,
            proposalTitle,
            proposalDescription
        } = community;
        const signatures = ['updateBeneficiaryParams(address,uint256,uint256,uint256,uint256,uint256,uint256)'];

        const calldatas = [
            defaultAbiCoder.encode(
                ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
                [
                    communityAddress,
                    claimAmount,
                    maxClaim,
                    decreaseStep,
                    baseInterval,
                    incrementInterval,
                    maxBeneficiaries
                ]
            )
        ];

        const tx = await impactMarketCouncil.populateTransaction.propose(
            signatures,
            calldatas,
            JSON.stringify({
                description: proposalDescription,
                title: proposalTitle
            })
        );
        const response = await executeTransaction(connection, address, cusd, tx);
        const ifaceDAO = new Interface(ImpactMarketCouncilABI);

        return parseInt(ifaceDAO.parseLog(response.logs[0]).args![0].toString(), 10);
    };

    /**
     * @dev Execute a proposal
     * @param {number} proposalId proposal id
     * @returns {ethers.ContractReceipt} transaction receipt
     */
    const execute = async (proposalId: number) => {
        if (!connection || !address) {
            return;
        }
        const { cusd, impactMarketCouncil } = await getContracts(provider);
        const tx = await impactMarketCouncil.populateTransaction.execute(proposalId);
        const response = await executeTransaction(connection, address, cusd, tx);

        return response;
    };

    /**
     * @dev Cancel a proposal
     * @param {number} proposalId proposal id
     * @returns {ethers.ContractReceipt} transaction receipt
     */
    const cancel = async (proposalId: number) => {
        if (!connection || !address) {
            return;
        }
        const { cusd, impactMarketCouncil } = await getContracts(provider);
        const tx = await impactMarketCouncil.populateTransaction.cancel(proposalId);
        const response = await executeTransaction(connection, address, cusd, tx);

        return response;
    };

    /**
     * @dev Vote on a proposal
     * @param {number} proposalId proposal id
     * @param {number} support proposal support: 0 - against, 1 - for, 2 - abstain
     * @returns {ethers.ContractReceipt} transaction receipt
     */
    const vote = async (proposalId: number, support: number) => {
        if (!connection || !address) {
            return;
        }
        const { cusd, impactMarketCouncil } = await getContracts(provider);
        const tx = await impactMarketCouncil.populateTransaction.castVote(proposalId, support);
        const response = await executeTransaction(connection, address, cusd, tx);

        return response;
    };

    /**
     * @dev Get proposals details
     * @param {number} first first x proposals
     * @param {number} skip skip x proposals
     * @param {sring | undefined} userAddress user address (optional - usd to verify if user voted)
     * @returns {object} proposals array
     */
    const getProposals = async (first: number, skip: number, userAddress?: string) => {
        if (!isReady) {
            throw new Error('wait until isReady is true');
        }

        return await ubiManagementSubgraph.getProposals(first, skip, quorumVotes, userAddress);
    };

    return {
        addCommunity,
        cancel,
        execute,
        getProposals,
        isReady,
        proposalCount,
        quorumVotes,
        removeCommunity,
        updateBeneficiaryParams,
        updateCommunityParams,
        vote
    };
};
