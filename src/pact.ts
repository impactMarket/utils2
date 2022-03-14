import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { BigNumber } from 'bignumber.js';
import { Contract } from '@ethersproject/contracts';
import { ContractAddresses } from './contractAddress';
import { getContracts } from './contracts';
import { toNumber } from './toNumber';
import ERC20ABI from './abi/BaseERC20.json';
import axios from 'axios';
import type { BaseProvider } from '@ethersproject/providers';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'https://api.thegraph.com/subgraphs/name/ubeswap/ubeswap'
});

export async function circulatingSupply(provider: BaseProvider) {
    const { chainId } = await provider.getNetwork();
    const contractAddresses = ContractAddresses.get(chainId)!;

    const { PACTDelegator, PACTToken, DonationMiner, MerkleDistributor, ImpactLabs, IDO } = contractAddresses;

    const decimals = new BigNumber(10).pow(18);
    const pact = new Contract(PACTToken, ERC20ABI, provider);
    const airgrabPACTBalance = await pact.balanceOf(MerkleDistributor);
    const daoPACTBalance = await pact.balanceOf(PACTDelegator);
    const donationMinerPACTBalance = await pact.balanceOf(DonationMiner);
    const impactLabsPACTBalance = await pact.balanceOf(ImpactLabs);
    const idoPACTBalance = await pact.balanceOf(IDO);
    // 10B
    const totalSupply = new BigNumber(10000000000).multipliedBy(decimals);
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
            dailyVolumeUSD: '0',
            priceUSD: '0',
            tokenHolders: 0,
            totalLiquidityUSD: '0',
            transfers: 0
        };
    }
    const contractAddresses = ContractAddresses.get(chainId)!;

    const { PACTToken } = contractAddresses;

    let statsFromUbeswapSubgraph = {
        dailyVolumeUSD: '--',
        priceUSD: '--',
        totalLiquidityUSD: '--',
    };

    try {
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

        statsFromUbeswapSubgraph = result.data.tokenDayDatas[0];
    } catch (_) {}
    let counters = { data: { token_holder_count: 0, transfer_count: 0 } };

    try {
        counters = await axios.get(`https://explorer.celo.org/token-counters?id=${PACTToken}`);
    } catch (_) {}

    return {
        ...statsFromUbeswapSubgraph,
        tokenHolders: counters.data.token_holder_count,
        transfers: counters.data.transfer_count
    };
}

export async function hasPACTVotingPower(provider: BaseProvider, address: string) {
    const { pact: pactContract, delegate } = await getContracts(provider);

    if (
        address === null ||
        !delegate?.address ||
        !delegate?.provider ||
        !pactContract?.address ||
        !pactContract?.provider
    ) {
        return;
    }

    try {
        const [proposalThreshold, currentVotes] = await Promise.all([
            delegate.proposalThreshold(),
            pactContract.getCurrentVotes(address)
        ]);

        return new BigNumber(currentVotes.toString()).gte(proposalThreshold.toString());
    } catch (error) {
        console.log(`Error getting voting power...\n${error}`);

        return false;
    }
}

export async function getPACTTVL(provider: BaseProvider): Promise<string> {
    const { chainId } = await provider.getNetwork();

    // if not on mainnet
    if (chainId !== 42220) {
        return '--';
    }
    const contractAddresses = ContractAddresses.get(chainId)!;

    const { PACTToken, PACTDelegator } = contractAddresses;

    try {
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
                    }
                }
                `
        });
    
        const pact = new Contract(PACTToken, ERC20ABI, provider);
        const TVL =
            toNumber((await pact.balanceOf(PACTDelegator)).toString()) * parseFloat(result.data.tokenDayDatas[0].priceUSD);
    
        return TVL.toString();
    } catch (_) {
        return '--';
    }
}

export async function getUBILiquidity(provider: BaseProvider): Promise<number> {
    const { chainId } = await provider.getNetwork();
    const contractAddresses = ContractAddresses.get(chainId)!;

    const { cUSD, Treasury } = contractAddresses;
    const cusd = new Contract(cUSD, ERC20ABI, provider);

    return toNumber((await cusd.balanceOf(Treasury)).toString());
}
