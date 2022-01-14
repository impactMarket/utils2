import React, { useEffect } from 'react';
import { ImpactMarketContext } from '../components/ImpactMarketProvider';

export const useEpoch = () => {
    const { epoch, updateEpoch } = React.useContext(ImpactMarketContext);
    let refreshInterval: NodeJS.Timeout;
    let timeoutInterval: NodeJS.Timeout;

    useEffect(() => {
        if (epoch?.endPeriod !== undefined && timeoutInterval === undefined) {
            const end = new Date(epoch?.endPeriod);
            const now = new Date();
            // 10 minutes
            if (end.getTime() - now.getTime() < 600000) {
                timeoutInterval = setTimeout(
                    () => updateEpoch(),
                    end.getTime() - now.getTime() - 1000
                );
            }
        }
        return () => {
            clearTimeout(timeoutInterval);
        };
    }, [epoch]);

    useEffect(() => {
        refreshInterval = setInterval(() => updateEpoch(), 300000); // 5 minutes
        updateEpoch();
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    return { epoch };
};
