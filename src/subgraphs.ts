import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';
import { subgraphCeloAlfajores, subgraphCeloMainnet } from './config';

class ImpactMarketSubgraph {
    private client: ApolloClient<NormalizedCacheObject>;
    constructor(isTestnet = false) {
        this.client = new ApolloClient({
            cache: new InMemoryCache(),
            uri: isTestnet ? subgraphCeloAlfajores : subgraphCeloMainnet
        });
    }

    async getCommunityData(community: string, query: string): Promise<{
        claimAmount?: string;
        maxClaim?: string;
        baseInterval?: number;
        incrementInterval?: number;
        beneficiaries?: number;
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

export default ImpactMarketSubgraph;
