import React, { useEffect } from 'react';
import WalletConnection from '../WalletConnection';
import { getPACTTradingMetrics } from '@impact-market/utils';
import { JsonRpcProvider } from '@ethersproject/providers';
import { CeloMainnet } from '@celo-tools/use-contractkit';

const PACTMetrics = () => {
    const [pactTradingMetrics, setPactTradingMetrics] = React.useState<{
        priceUSD: string;
        dailyVolumeUSD: string;
        totalLiquidityUSD: string;
        txCount: string;
    }>({ priceUSD: '', dailyVolumeUSD: '', totalLiquidityUSD: '', txCount: '' });

    useEffect(() => {
        const loadPactPriceVolumeLiquidity = async () => {
            const r = await getPACTTradingMetrics(new JsonRpcProvider(CeloMainnet.rpcUrl));
            setPactTradingMetrics(r);
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
                    <div>txCount {pactTradingMetrics.txCount}</div>
                </li>
            </ul>
        </WalletConnection>
    );
}

export default PACTMetrics;
