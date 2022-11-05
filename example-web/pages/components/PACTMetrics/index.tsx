import React, { useEffect } from 'react';
import { getPACTTradingMetrics, getPACTTVL, getUBILiquidity } from '@impact-market/utils/pact';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Mainnet } from '@celo/react-celo';

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
            const provider = new JsonRpcProvider(Mainnet.rpcUrl);
            const r = await getPACTTradingMetrics(provider);
            const tvl = await getPACTTVL(provider);
            const ubiLiquidity = await getUBILiquidity(provider);
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
