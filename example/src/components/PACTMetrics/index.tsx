import React, { useEffect } from 'react';
import WalletConnection from '../WalletConnection';
import { getPACTTradingMetrics, getPACTTVL, getUBILiquidity } from '@impact-market/utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import { CeloMainnet } from '@celo-tools/use-contractkit';

const PACTMetrics = () => {
    const [pactTradingMetrics, setPactTradingMetrics] = React.useState<{
        priceUSD: string;
        dailyVolumeUSD: string;
        totalLiquidityUSD: string;
        tokenHolders: number;
        transfers: number;
        tvl: number;
        ubiLiquidity: number;
    }>({ priceUSD: '', dailyVolumeUSD: '', totalLiquidityUSD: '', tokenHolders: 0, transfers: 0, tvl: 0, ubiLiquidity: 0 });

    useEffect(() => {
        const loadPactPriceVolumeLiquidity = async () => {
            const provider = new JsonRpcProvider(CeloMainnet.rpcUrl);
            const r = await getPACTTradingMetrics(provider);
            const tvl = await getPACTTVL(provider);
            const ubiLiquidity = await getUBILiquidity(provider);
            console.log({ ...r, tvl, ubiLiquidity })
            setPactTradingMetrics({ ...r, tvl, ubiLiquidity });
        }
        loadPactPriceVolumeLiquidity();
    }, []);

    return (
        <WalletConnection title="PACT Metrics">
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
        </WalletConnection>
    );
}

export default PACTMetrics;
