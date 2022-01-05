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

export async function getUBIState(): Promise<{
    communities: number;
    beneficiaries: number;
    managers: number;
    contributed: string;
    claimed: string;
}> {
    const result = await client.query({
        query: gql`
            {
                ubientity(id: "0") {
                    communities
                    beneficiaries
                    managers
                    contributed
                    claimed
                }
            }
        `
    });
    return result.data.ubientity;
}

export async function getUBIDaily(query: {
    startDayId: number;
    endDayId: number;
}): Promise<
    [
        {
            communities: number;
            beneficiaries: number;
            managers: number;
            contributed: string;
            claimed: string;
        }
    ]
> {
    const result = await client.query({
        query: gql`
            {
                ubidailyEntities(
                    orderBy: id
                    orderDirection: desc
                    where: { id_gte: ${query.startDayId}, id_lte: ${query.endDayId} }
                ) {
                    communities
                    beneficiaries
                    managers
                    contributed
                    claimed
                }
            }
        `
    });
    return result.data.ubidailyEntities;
}

export async function getManagers(query: {
    state: number;
    community: string;
}): Promise<
    [
        {
            address: string;
            added: number;
            removed: number;
        }
    ]
> {
    const result = await client.query({
        query: gql`
            {
                managerEntities(
                    orderBy: added
                    orderDirection: desc
                    where: { state: ${query.state}, community: "${query.community}" }
                ) {
                    address
                    added
                    removed
                }
            }
        `
    });
    return result.data.managerEntities;
}

export async function getBeneficiaries(query: {
    state: number;
    community: string;
}): Promise<
    [
        {
            address: string;
            lastClaimAt: string;
            preLastClaimAt: string;
        }
    ]
> {
    const result = await client.query({
        query: gql`
            {
                beneficiaryEntities(
                    orderBy: lastClaimAt
                    orderDirection: desc
                    where: { state: ${query.state}, community: "${query.community}" }
                ) {
                    address
                    lastClaimAt
                    preLastClaimAt
                }
            }
        `
    });
    return result.data.beneficiaryEntities;
}

export async function getUserActivity(query: {
    user: string;
    community: string;
}): Promise<
    [
        {
            by: string;
            timestamp: number;
            activity: string;
        }
    ]
> {
    const result = await client.query({
        query: gql`
            {
                useractivityEntities(
                    orderBy: timestamp
                    orderDirection: desc
                    where: { user: "${query.user}", community: "${query.community}" }
                ) {
                    by
                    timestamp
                    activity
                }
            }
        `
    });
    return result.data.useractivityEntities;
}

export async function getUsersActivity(query: { community: string }): Promise<
    [
        {
            user: string;
            by: string;
            timestamp: number;
            activity: string;
        }
    ]
> {
    const result = await client.query({
        query: gql`
            {
                useractivityEntities(
                    orderBy: timestamp
                    orderDirection: desc
                    where: { community: "${query.community}" }
                ) {
                    user
                    by
                    timestamp
                    activity
                }
            }
        `
    });
    return result.data.useractivityEntities;
}
