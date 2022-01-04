import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/impactmarket/subgraph',
    cache: new InMemoryCache()
});

export async function getAddCommunityProposals(query: {
    first: number;
    skip: number;
}): Promise<
    [
        {
            id: string;
            endBlock: number;
            status: number;
        }
    ]
> {
    const result = await client.query({
        query: gql`
            {
                proposalEntities(
                    first: ${query.first}
                    skip: ${query.skip}
                    orderBy: id
                    orderDirection: desc
                    where: { signatures_contains: ["addCommunity"] }
                ) {
                    id
                    status
                    endBlock
                }
            }
        `
    });
    return result.data.proposalEntities;
}
