import React, { useEffect } from 'react';
import { getPACTTradingMetrics, getPACTTVL, getUBILiquidity } from '@impact-market/utils/pact';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { celo } from '@wagmi/chains';

const PACTMetrics = () => {
    const [pactTradingMetrics, setPactTradingMetrics] = React.useState<{
        priceUSD: string;
        dailyVolumeUSD: string;
        totalLiquidityUSD: string;
        tokenHolders: number;
        transfers: number;
        tvl: number;
        ubiLiquidity: number;
    }>({
        priceUSD: '',
        dailyVolumeUSD: '',
        totalLiquidityUSD: '',
        tokenHolders: 0,
        transfers: 0,
        tvl: 0,
        ubiLiquidity: 0
    });

    useEffect(() => {
        const loadPactPriceVolumeLiquidity = async () => {
            const provider = new StaticJsonRpcProvider(celo.rpcUrls.default.http[0]);
            const { chainId } = await provider.getNetwork();
            const r = await getPACTTradingMetrics(chainId);
            const tvl = await getPACTTVL(provider, chainId);
            const ubiLiquidity = await getUBILiquidity(provider, chainId);
            setPactTradingMetrics({ ...r, tvl: parseInt(tvl, 10), ubiLiquidity });
        };
        loadPactPriceVolumeLiquidity();
    }, []);

    return (
        <ul>
            <li style={{ marginTop: 16 }}>
                <div>priceUSD ${pactTradingMetrics.priceUSD}</div>
            </li>
            <li style={{ marginTop: 16 }}>
                <div>dailyVolumeUSD {pactTradingMetrics.dailyVolumeUSD}</div>
            </li>
            <li style={{ marginTop: 16 }}>
                <div>totalLiquidityUSD {pactTradingMetrics.totalLiquidityUSD}</div>
            </li>
            <li style={{ marginTop: 16 }}>
                <div>tokenHolders {pactTradingMetrics.tokenHolders}</div>
            </li>
            <li style={{ marginTop: 16 }}>
                <div>transfers {pactTradingMetrics.transfers}</div>
            </li>
            <li style={{ marginTop: 16 }}>
                <div>tvl {pactTradingMetrics.tvl}</div>
            </li>
            <li style={{ marginTop: 16 }}>
                <div>ubiLiquidity {pactTradingMetrics.ubiLiquidity}</div>
            </li>
        </ul>
    );
};

export default PACTMetrics;
