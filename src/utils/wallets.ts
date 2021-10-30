import toNumber from '../helpers/toNumber';
import axios, { AxiosResponse } from 'axios';

const instance = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3/coins'
});

const getCoinPrice = async (coin: string) =>
    (
        await instance.get<
            any,
            AxiosResponse<{
                // eslint-disable-next-line camelcase
                market_data: { current_price: { [key: string]: number } };
            }>
        >(
            `/${coin}?tickers=false&community_data=false&developer_data=false&sparkline=false`
        )
    ).data.market_data.current_price.usd;

const getEtherScanBalance = async (
    wallet: string,
    etherscanApiKey: string,
    balanceOf: 'eth' | 'dai' | 'usdc' | 'usdt'
) => {
    let queryCoin = '';
    if (balanceOf === 'eth') {
        queryCoin = 'action=balance';
    } else if (balanceOf === 'dai') {
        queryCoin =
            'action=tokenbalance&contractaddress=0x6b175474e89094c44da98b954eedeac495271d0f';
    } else if (balanceOf === 'usdc') {
        queryCoin =
            'action=tokenbalance&contractaddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    } else if (balanceOf === 'usdt') {
        queryCoin =
            'action=tokenbalance&contractaddress=0xdac17f958d2ee523a2206206994597c13d831ec7';
    }
    const balance = await axios.get<any, AxiosResponse<{ result: string }>>(
        `https://api.etherscan.io/api?module=account&${queryCoin}&address=${wallet}&tag=latest&apikey=${etherscanApiKey}`
    );
    if (balanceOf === 'eth') {
        return toNumber(balance.data.result);
    }
    return parseInt(balance.data.result) / 1000000;
};

const getCeloApiBalance = async (
    wallet: string,
    balanceOf: 'celo' | 'cusd' | 'ceur'
) => {
    let queryCoin = '';
    if (balanceOf === 'celo') {
        queryCoin = '0x471EcE3750Da237f93B8E339c536989b8978a438';
    } else if (balanceOf === 'cusd') {
        queryCoin = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
    } else if (balanceOf === 'ceur') {
        queryCoin = '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73';
    }
    const balance = await axios.get<any, AxiosResponse<{ result: string }>>(
        `https://explorer.celo.org/api?module=account&action=tokenbalance&contractaddress=${queryCoin}&address=${wallet}`
    );
    return balance.data.result;
};

const getCeloWalletBalance = async (wallet: string) => {
    const celo_ = await getCoinPrice('celo');
    const ceur_ = await getCoinPrice('celo-euro');

    const ceurBalance = await getCeloApiBalance(wallet, 'ceur');
    const cusdBalance = await getCeloApiBalance(wallet, 'cusd');
    const celoBalance = await getCeloApiBalance(wallet, 'celo');

    return (
        toNumber(ceurBalance) * ceur_ +
        toNumber(cusdBalance) +
        toNumber(celoBalance) * celo_
    );
};

const getEthereumWalletBalance = async (
    wallet: string,
    etherscanApiKey: string
) => {
    const ethereum_ = await getCoinPrice('ethereum');
    const balanceETH = await getEtherScanBalance(
        wallet,
        etherscanApiKey,
        'eth'
    );
    const balanceDAI = await getEtherScanBalance(
        wallet,
        etherscanApiKey,
        'dai'
    );
    const balanceUSDC = await getEtherScanBalance(
        wallet,
        etherscanApiKey,
        'usdc'
    );
    const balanceUSDT = await getEtherScanBalance(
        wallet,
        etherscanApiKey,
        'usdt'
    );
    // console.log({ balanceETH, balanceUSDC, balanceDAI, balanceUSDT });
    return ethereum_ * balanceETH + balanceUSDC + balanceDAI + balanceUSDT;
};

export async function getWalletsBalance(props: {
    wallets: { celo: string; ethereum: string; bitcoin: string };
    etherscanApiKey: string;
}) {
    return {
        ethereum: await getEthereumWalletBalance(
            props.wallets.ethereum,
            props.etherscanApiKey
        ),
        celo: await getCeloWalletBalance(props.wallets.celo)
    };
}
