import ERC20ABI from '../contracts/abi/BaseERC20.json';
import { BigNumber } from 'bignumber.js';
import { ContractAddresses } from '../contracts';
import { BaseProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import axios from 'axios';

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/ubeswap/ubeswap',
    cache: new InMemoryCache()
});

export async function circulatingSupply(provider: BaseProvider) {
    const { chainId } = await provider.getNetwork();
    const contractAddresses = ContractAddresses.get(chainId)!;

    const {
        PACTDelegator,
        PACTToken,
        DonationMiner,
        MerkleDistributor,
        ImpactLabs,
        IDO
    } = contractAddresses;

    const decimals = new BigNumber(10).pow(18);
    const pact = new Contract(PACTToken, ERC20ABI, provider);
    const airgrabPACTBalance = await pact.balanceOf(MerkleDistributor);
    const daoPACTBalance = await pact.balanceOf(PACTDelegator);
    const donationMinerPACTBalance = await pact.balanceOf(DonationMiner);
    const impactLabsPACTBalance = await pact.balanceOf(ImpactLabs);
    const idoPACTBalance = await pact.balanceOf(IDO);
    const totalSupply = new BigNumber(10000000000).multipliedBy(decimals); // 10B
    const circulatingSupply = new BigNumber(totalSupply)
        .minus(airgrabPACTBalance.toString())
        .minus(daoPACTBalance.toString())
        .minus(donationMinerPACTBalance.toString())
        .minus(impactLabsPACTBalance.toString())
        .minus(idoPACTBalance.toString());
    return circulatingSupply.dividedBy(decimals).toNumber();
}

export async function getPACTTradingMetrics(provider: BaseProvider): Promise<{
    priceUSD: string;
    dailyVolumeUSD: string;
    totalLiquidityUSD: string;
    tokenHolders: number;
    transfers: number;
}> {
    const { chainId } = await provider.getNetwork();
    // if not on mainnet
    if (chainId !== 42220) {
        return {
            priceUSD: '0',
            dailyVolumeUSD: '0',
            totalLiquidityUSD: '0',
            tokenHolders: 0,
            transfers: 0
        };
    }
    const contractAddresses = ContractAddresses.get(chainId)!;

    const { PACTToken } = contractAddresses;

    const result = await client.query({
        query: gql`
            {
                tokenDayDatas(
                    first:1
                    orderBy: date
                    orderDirection: desc
                    where: {token: "${PACTToken.toLowerCase()}"}
                ) {
                    priceUSD
                    dailyVolumeUSD
                    totalLiquidityUSD
                }
            }
            `
    });
    let counters = { data: { token_holder_count: 0, transfer_count: 0 } };
    try {
        counters = await axios.get(
            `https://explorer.celo.org/token-counters?id=${PACTToken}`
        );
    } catch (_) {}
    return {
        ...result.data.tokenDayDatas[0],
        tokenHolders: counters.data.token_holder_count,
        transfers: counters.data.transfer_count
    };
}
