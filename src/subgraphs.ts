import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';
import { JsonRpcProvider } from '@ethersproject/providers';
import {
    subgraphCeloAlfajores,
    subgraphCeloMainnet,
    ubiManagementSubgraphCeloAlfajores,
    ubiManagementSubgraphCeloMainnet
} from './config';

class ImpactMarketSubgraph {
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(isTestnet = false) {
        this.client = new ApolloClient({
            cache: new InMemoryCache(),
            uri: isTestnet ? subgraphCeloAlfajores : subgraphCeloMainnet
        });
    }

    async findBeneficiaries(
        beneficiaries: string[],
        query: string
    ): Promise<
        [
            {
                id?: string;
                state?: number;
                community?: { id: string };
            }
        ]
    > {
        const result = await this.client.query({
            query: gql`
                {
                    beneficiaryEntities(where: { id_in: [${beneficiaries.map(b => `"${b.toLowerCase()}"`)}] }) ${query}
                }
                `
        });

        return result.data.beneficiaryEntities;
    }

    async getBeneficiaryData(
        beneficiary: string,
        query: string
    ): Promise<{
        state?: number;
        claimed?: string;
    }> {
        const result = await this.client.query({
            query: gql`
                {
                    beneficiaryEntity(id: "${beneficiary.toLowerCase()}") ${query}
                }
                `
        });

        return result.data.beneficiaryEntity;
    }

    async getCommunityData(
        community: string,
        query: string
    ): Promise<{
        claimAmount?: string;
        maxClaim?: string;
        baseInterval?: number;
        incrementInterval?: number;
        beneficiaries?: number;
        state?: number;
    }> {
        const result = await this.client.query({
            query: gql`
                {
                    communityEntity(id: "${community.toLowerCase()}") ${query}
                }
                `
        });

        return result.data.communityEntity;
    }
}
class ImpactMarketUBIManagementSubgraph {
    private client: ApolloClient<NormalizedCacheObject>;
    private provider: JsonRpcProvider;
    constructor(rpcUrl: string, isTestnet = false) {
        this.client = new ApolloClient({
            cache: new InMemoryCache(),
            uri: isTestnet ? ubiManagementSubgraphCeloAlfajores : ubiManagementSubgraphCeloMainnet
        });
        this.provider = new JsonRpcProvider(rpcUrl);
    }

    async getProposals(
        first: number,
        skip: number,
        quorumVotes: number,
        userAddress?: string
    ): Promise<
        {
            id: number;
            createdAt: number;
            proposer: string;
            signatures: string[];
            endBlock: number;
            description: string;
            votesAgainst: number;
            votesFor: number;
            votesAbstain: number;
            userVoted: number;
            status: 'canceled' | 'executed' | 'ready' | 'defeated' | 'expired' | 'active';
        }[]
    > {
        const blockNumber = await this.provider.getBlockNumber();
        const result = await this.client.query({
            query: gql`
                {
                    proposalEntities(first: ${first} skip: ${skip} orderBy: createdAt orderDirection: desc) {
                        id
                        createdAt
                        proposer
                        signatures
                        endBlock
                        description
                        status
                        votedAgainst
                        votedFor
                        votedAbstain
                    }
                }
                `
        });

        // eslint-disable-next-line no-nested-ternary
        const userVoted = (proposal: any) =>
            // eslint-disable-next-line no-nested-ternary
            proposal.votedAgainst.includes(userAddress?.toLowerCase())
                ? 0
                : // eslint-disable-next-line no-nested-ternary
                proposal.votedFor.includes(userAddress?.toLowerCase())
                ? 1
                : proposal.votedAbstain.includes(userAddress?.toLowerCase())
                ? 2
                : -1;

        return result.data.proposalEntities.map((proposal: any) => ({
            ...proposal,
            // eslint-disable-next-line no-nested-ternary
            status:
                // eslint-disable-next-line no-nested-ternary
                proposal.status === 2
                    ? 'canceled'
                    : // eslint-disable-next-line no-nested-ternary
                    proposal.status === 1
                    ? 'executed'
                    : // eslint-disable-next-line no-nested-ternary
                    proposal.votedAgainst.length >= quorumVotes
                    ? 'defeated'
                    : // eslint-disable-next-line no-nested-ternary
                    proposal.votedFor.length >= quorumVotes
                    ? 'ready'
                    : proposal.endBlock < blockNumber
                    ? 'expired'
                    : 'active',
            userVoted: userVoted(proposal),
            votesAbstain: proposal.votedAbstain.length,
            votesAgainst: proposal.votedAgainst.length,
            votesFor: proposal.votedFor.length
        }));
    }
}

export { ImpactMarketSubgraph, ImpactMarketUBIManagementSubgraph };
